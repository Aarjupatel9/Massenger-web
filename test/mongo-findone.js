const { MongoClient, ObjectId } = require("mongodb");

//mongodb
var url = "mongodb://localhost:27017/";
var mainDb;
var DbO;
console
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  mainDb = db;
  DbO = mainDb.db("massenger");
  DbO.collection("masseges").findOne(
    {
      _id: ObjectId("6440d837f60588934b7c1447"),
      Contacts: {
        $elemMatch: {
          _id: ObjectId("6440da64a72c6878e94754f2"),
          massegeHolder: {
            $elemMatch: { _id: new ObjectId("6440dfa8613c1e52168354c7") },
          },
        },
      },
    },
    (err, result) => {
      if (err) throw err;
      console.log(
        "result for : ",
        MainId,
        " contacts : ",
        id,
        " and masselastid :",
        lastMassegeId
      );
      console.log("result is : ", result);
    }
  );
});
