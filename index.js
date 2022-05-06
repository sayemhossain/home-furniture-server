const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//username: dbuser
//pass: TDMuDLwEUALynvoG
// middleware
app.use(cors());
app.use(express.json());

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
    //update quantity
    app.put("/furnitures/:id", async (req, res) => {
      const id = req.params.id;
      const newQuantity = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: newQuantity.restock,
        },
      };
      const result = await furniturecollection.updateOne(
        query,
        updatedDoc,
        options
      );
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
