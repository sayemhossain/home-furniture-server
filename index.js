const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

//username: homeFurniture
//pass: AcERklDKjeQ6zSnZ

// from mongodb
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://homeFurniture:<password>@cluster0.ihsnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// from mongodb end

// this is basic setup
app.get("/", (req, res) => {
  res.send("home furniture server is running");
});

app.listen(port, () => {
  console.log("Listening to port: ", port);
});
