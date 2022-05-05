const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");

//username: dbuser
//pass: TDMuDLwEUALynvoG
// middleware
app.use(cors());
app.use(express.json());

// from mongodb

const uri =
  "mongodb+srv://dbuser:TDMuDLwEUALynvoG@cluster0.ihsnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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
  } finally {
  }
}
run().catch(console.dir);
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   console.log("conndeddafdsfasdf");
//   // perform actions on the collection object
//   client.close();
// });

// from mongodb end

// this is basic setup
app.get("/", (req, res) => {
  res.send("home furniture server is running");
});

app.listen(port, () => {
  console.log("Listening to port: ", port);
});
