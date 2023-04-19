const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholders with your credentials and hostname
const uri = "mongodb://localhost:27017/";

var DB;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
  .connect()
  .then((e) => {
    run().catch((e) => {
      console.log("run function catch : ", e);
    });
  });
async function run() {
  try {
    

    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    const x = await client.db("massenger");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",x
    );
    // const Login_infoColl = x.collection("login_info");
    // const doc = {
    //   username: "username",
    //   email: "email",
    //   password: "hashedPassword",
    //   originalPassword: "password",
    //   about: "hi i am using massenger",
    // };
    // const result = await Login_infoColl.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
