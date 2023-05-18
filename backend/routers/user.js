const express = require("express");
var cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const authController = require("../controllers/auth");

const router = express.Router();
router.use(cors());

var url = "mongodb://localhost:27017/";
var mainDb;
var dbo;
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  mainDb = db;
  dbo = mainDb.db("massenger");
});

router.get("/", (req, res) => {
  res.send({ name: "aarju" });
});
router.post("/newContactAddForUser", bodyParser.json(), async (req, res) => {
  console.log("newContactAddForUser || id: ", req.body.id);

  const findUser = await dbo
    .collection("login_info")
    .findOne({ email: req.body.email });
  if (findUser) {
    console.log("findUser is :", findUser);

    dbo.collection("user_info").findOne(
      {
        _id: ObjectId(req.body.id),
        ContactsEmails: { $elemMatch: { email: req.body.email } },
      },
      (err, result) => {
        if (err) {
          // Handle the error
          console.log("error : ", err);
        } else if (result) {
          console.log("result : ", result);
          const response = {
            status: 2,
            data: null,
          };
          res.send(response);
          return;
        } else {
          // The document was not found or does not contain the search object
          console.log("else : ...", err, " and ", result);

          const response = {
            status: 1,
            data: null,
          };
          dbo.collection("masseges").updateOne(
            { _id: ObjectId(req.body.id) },
            {
              $push: {
                Contacts: {
                  _id: findUser._id,
                  massegeHolder: [],
                },
              },
            },
            (err, result) => {
              if (err) {
                console.log("massegeHolder error array updarte : ", err);
              } else {
                console.log("massegeHolder array update result is : ", result);
              }
            }
          );

          dbo.collection("user_info").updateOne(
            { _id: ObjectId(req.body.id) },
            {
              $push: {
                ContactsEmails: {
                  _id: findUser._id,
                  email: req.body.email,
                  name: req.body.name,
                },
              },
            },
            (err, result) => {
              if (err) {
                console.log("error array updarte : ", err);
              } else {
                console.log("array update result is : ", result);
              }
              res.send(response);
            }
          );
        }
      }
    );

    // const check1 = await dbo.collection("user_info").findOne({
    //   _id: ObjectId(req.body.id),
    //   ContactsEmails: { email: req.body.email },
    // });
    // console.log("ckeck1 : ", check1);
    // const response = {
    //   status: 2,
    //   data: null,
    // };
    // if (check1 == null) {

    //   response.status = 1;
    //   const result = await dbo.collection("user_info").updateOne(
    //     { _id: ObjectId(req.body.id) },
    //     {
    //       $push: {
    //         ContactsEmails: { email: req.body.email, _id: findUser._id ,name: req.body.name },
    //       },
    //     }
    //   );
    //   console.log("result is :", result);
    // }
    // res.send(response);
  } else {
    console.log("finduser null : ", findUser);
    const response = {
      status: 0,
      data: null,
    };
    res.send(response);
  }
});

router.post("/updateMyContacts", bodyParser.json(), async (req, res) => {
  console.log("updateMyContacts || id: ", req.body._id);
  const contact = await dbo
    .collection("user_info")
    .findOne({ _id: ObjectId(req.body._id) });

  
  const response = {
    status: 1,
  };

  if (contact == null) {
    response["data"] = [];
  } else {
    response["data"] = contact.ContactsEmails;
  }
  
  console.log("ContactEmails : ", response);

  res.send(response);
});

module.exports = router;


// { _id: ObjectId('6440d837f60588934b7c1447'), Contacts: { $elemMatch: { _id: ObjectId('6440da64a72c6878e94754f2'), massegeHolder : { $elemMatch: { _id: ObjectId('6440dfa8613c1e52168354c7') } } }

//   { _id: ObjectId('6440d837f60588934b7c1447'), Contacts: { $elemMatch: { _id: ObjectId('6440da64a72c6878e94754f2') } } }

//    { Contacts: { $elemMatch: { _id: ObjectId('6440da64a72c6878e94754f2'), massegeHolder: { $elemMatch: {  _id: ObjectId('6440dfa8613c1e52168354c7') } } } } },
//     { 'Contacts.$': 1, 'Contacts.MessageList.$': 1 }, 
    