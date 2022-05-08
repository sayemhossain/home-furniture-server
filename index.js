const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//username: dbuser
//pass: TDMuDLwEUALynvoG
// middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidded access" });
    } else {
      req.decoded = decoded;
      next();
    }
  });
}

// from mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihsnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("DB connected");
    const furniturecollection = client
      .db("homeFurniture")
      .collection("furniture");

    // get all furniture from database
    app.get("/furnitures", async (req, res) => {
      const query = {};
      const cursor = furniturecollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // AUTH
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      res.send(accessToken);
    });

    //find one using id from database
    app.get("/furnitures/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const furniture = await furniturecollection.findOne(query);
      res.send(furniture);
    });

    //post data for update quantity
    app.post("/furnitures", async (req, res) => {
      const newFurniture = req.body;
      const result = await furniturecollection.insertOne(newFurniture);
      res.send(result);
    });

    // add new furniture
    app.post("/furnitures", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    //Delete
    app.delete("/furnitures/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await furniturecollection.deleteOne(query);
      res.send(result);
    });
    //update quantity
    app.put("/furnitures/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      const a = updatedQuantity.x;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      if (a == 1) {
        const updatedDoc = {
          $set: {
            quantity: updatedQuantity.newQuantity,
          },
        };
        const result = await furniturecollection.updateOne(
          query,
          updatedDoc,
          options
        );
        res.send(result);
      } else {
        const updatedDoc = {
          $set: {
            quantity: updatedQuantity.deliverQuantity,
          },
        };
        const result = await furniturecollection.updateOne(
          query,
          updatedDoc,
          options
        );
        res.send(result);
      }
    });

    //order collection api
    app.get("/items", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;

      if (email === decodedEmail) {
        const query = { email: email };
        const cursor = furniturecollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } else {
        res.status(403).send({ message: "Forbeden access" });
      }
    });

    app.post("/items", async (req, res) => {
      const items = req.body;
      const result = await furniturecollection.insertOne(items);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
// from mongodb end

// this is basic setup
app.get("/", (req, res) => {
  res.send("home furniture server is running");
});

app.listen(port, () => {
  console.log("Listening to port: ", port);
});
