const express = require("express");
const app = express();
const fs = require("fs");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");

dotenv.config({ path: "./.env" });
var bodyParser = require("body-parser");
const { Console } = require("console");
app.use(bodyParser.urlencoded({ limit: "2000kb", extended: true }));

//mongodb
var url = "mongodb://localhost:27017/";
var mainDb;
var DbO;
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  mainDb = db;
  DbO = mainDb.db("massenger");
});

//socket part
const sslOPtion = {
  key: fs.readFileSync("./ssl/newkey.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
};
var http = require("http").createServer(app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const port = 10002;
http.listen(port, function () {
  console.log("Server-socket listening at port %d", port);
});



var counter = 0;
var user_connection = [];
var user_connection_fast = [];
var user_connection_tmp1 = [];
var user_connection_counter = 0;


function joinMain(socket) {
  console.log(
    "in joinMain",
    socket.handshake.query.id,
    " and counter is : ",
    counter
  );
  var id = socket.handshake.query.id;
  if (!check_user_id(id)) {
    socket.join(id); // We are using room of socket io
    user_connection_tmp1[0] = id;
    user_connection_tmp1[1] = Date.now();
    user_connection_tmp1[2] = socket.id;

    user_connection[user_connection_counter] = user_connection_tmp1;
    user_connection_fast[user_connection_counter] = id;
    user_connection_counter++;

    io.sockets.in(id).emit("join_acknowledgement", { status: 1 });
    console.log("join || connecting to room of user_id :", id);
  } else {
    // //leaving exiting room
    // socket.leave(id);
    // //join with new one
    // socket.join(id);
    console.log("already connected");
  }
}
function check_user_id(id) {
   for (var i = 0; i < user_connection.length; i++) {
     if (user_connection_fast[i] == id) {
       return 1;
     }
   }
   return 0;
}

io.on("connection", function (socket) {
  counter++;
  joinMain(socket);

  

  socket.on("connect", function (socket) {
    const valuePassed = socket.handshake.query.valueToPass;
    console.log(`Value passed: ${valuePassed}`);
    console.log("Connected to server!");
  });
  socket.on("disconnect", function (socket) {
    console.log("DisConnected to server!");
  });

  socket.on("massege", function (currentUserId, massegeObj) {
    console.log(
      "massege is arrive from ",
      currentUserId,
      " and is :",
      massegeObj
    );

    console.log("from : ", massegeObj.from);
    console.log("from : ", massegeObj.to);

    massegeObj["_id"] = new ObjectId();
    DbO.collection("masseges").updateOne(
      {
        _id: ObjectId(massegeObj.from),
        Contacts: { $elemMatch: { _id: ObjectId(massegeObj.to) } },
      },
      { $push: { "Contacts.$.massegeHolder": massegeObj } },
      (err, result) => {
        if (err) throw err;
        console.log(`${result.modifiedCount} document(s) updated`);
      }
    );
    DbO.collection("masseges").updateOne(
      {
        _id: ObjectId(massegeObj.to),
        Contacts: { $elemMatch: { _id: ObjectId(massegeObj.from) } },
      },
      { $push: { "Contacts.$.massegeHolder": massegeObj } },
      (err, result) => {
        if (err) throw err;
        console.log(`${result.modifiedCount} document(s) updated`);
      }
    );
  });
  socket.on("UpdateMasseges", function (MainId, data) {
    console.log(
      "UpdateMasseges is arrive from  : ",
      MainId,
      " and data is :",
      data
    );

    for (const id in data) {
      if (data.hasOwnProperty(id)) {
        var lastMassegeId = data[id];
        console.log("contact id: ", id);
        console.log("contact last massege id: ", lastMassegeId);

        if (lastMassegeId == null) {
          lastMassegeId = "6440dfa8613c1e52168354c7";
        }

        //     DbO.collection("masseges").updateOne(
        //       {
        //         _id: ObjectId(massegeObj.from),
        //         Contacts: { $elemMatch: { _id: ObjectId(massegeObj.to) } },
        //       },
        //       { $push: { "Contacts.$.massegeHolder": massegeObj } },
        //       (err, result) => {
        //         if (err) throw err;
        //         console.log(`${result.modifiedCount} document(s) updated`);
        //       }
        //     );

        // //  { Contacts: { $elemMatch: { _id:  ObjectId(massegeObj.to), massegeHolder: { $elemMatch: { ID: messageId } } } } },
        // //     { 'Contacts.$': 1, 'Contacts.MessageList.$': 1 },

        // {_id: ObjectId('6440d822f60588934b7c1446'),Contacts: {$elemMatch: { _id: ObjectId('6440d837f60588934b7c1447'), massegeHolder: { $elemMatch: { _id: ObjectId('6441620950c4e01b835f3b36') } }}}}

        //      DbO.collection("masseges").findOne(
        //        {
        //          Contacts: {
        //            $elemMatch: {
        //              _id: contactId,
        //              MessageList: { $elemMatch: { _id: new ObjectId(messageId) } },
        //            },
        //          },
        //        },
        //        { "Contacts.$": 1, "Contacts.MessageList.$": 1 },
        //        (err, result) => {
        //          if (err) throw err;
        //          const contact = result.Contacts[0]; // retrieve the matched contact object
        //          const messageList = contact.MessageList; // retrieve the MessageList array of the matched contact object
        //          const index = messageList.findIndex((msg) =>
        //            msg._id.equals(new ObjectId(messageId))
        //          ); // find the index of the message object that matches the given message ID

        //          if (index !== -1) {
        //            const messagesAfter = messageList.slice(index + 1); // retrieve all message objects after the matched message object
        //            console.log(messagesAfter);
        //          }

        // //          client.close();
        //        }
        //      );

        // {_id: ObjectId('6440d822f60588934b7c1446'),Contacts: {$elemMatch: { _id: ObjectId('6440d837f60588934b7c1447'), massegeHolder: { $elemMatch: { _id: ObjectId('6441620950c4e01b835f3b36') } }}}}

        // DbO.collection("masseges").findOne(
        //   {
        //     _id: ObjectId(MainId),
        //     Contacts: {
        //       $elemMatch: {
        //         _id: ObjectId(id),
        //         massegeHolder: {
        //           time: { $gt: 0 },
        //         },
        //       },
        //     },
        //   },
        //   (err, result) => {
        //     if (err) throw err;
        //     console.log(
        //       "result for : ",
        //       MainId,
        //       " contacts : ",
        //       id,
        //       " and masselastid :",
        //       lastMassegeId
        //     );
        //     console.log("result is : ", result);
        //   }
        // );

        const result = DbO.collection("masseges").aggregate([
          {
            $match: {
              _id: ObjectId(MainId),
            },
          },
          {
            $unwind: "$Contacts",
          },
          {
            $match: {
              "Contacts._id": ObjectId(id),
            },
          },
          {
            $unwind: "$Contacts.massegeHolder",
          },
          {
            $match: {
              $or: [
                {
                  "Contacts.massegeHolder.time": { $gt: 10 },
                  "Contacts.massegeHolder.from": "6440da64a72c6878e94754f2",
                },
                {
                  "Contacts.massegeHolder.time": { $gt: 5 },
                  "Contacts.massegeHolder.from": "6440d822f60588934b7c1446",
                },
              ],
            },
          },
          {
            $group: {
              _id: null,
              selectedMessages: {
                $push: "$Contacts.massegeHolder",
              },
            },
          },
          {
            $project: {
              _id: 0,
              selectedMessages: 1,
            },
          },
        ]);

        result.toArray((err, res) => {
          if (err) {
            console.log("err : ", err);
          } else {
            console.log(
              "result for : ",
              MainId,
              " contacts : ",
              id,
              " and masselastid :",
              lastMassegeId
            );
            if (res.length > 0) {
              console.log(
                "res.length is : ",
                res.length,
                " || res is : ",
                res[0]
              );

              io.sockets.in(MainId).emit("new_massege_from_server", id, res[0]);

            } else {
              console.log("there is no massege for this contact");
            }
          }
        });
      }
    }
  });
});
