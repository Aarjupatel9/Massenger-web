

const express = require("express");
const app = express();
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ limit: "2000kb", extended: true }));

// enable CORS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://localhost:8081"); // Replace with the actual domain name of your client application
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

const sslOPtion = {
    key: fs.readFileSync("./ssl/newkey.pem"),
    cert : fs.readFileSync("./ssl/cert.pem")
}


//socket par
var http = require("https").createServer(sslOPtion,app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});


const port = 10002;

http.listen(port, function () {
  console.log("Server-socket listening at port %d", port);
});


io.on("connection", function (socket) {

    socket.on("join", function (user_id) {
        if (!check_user_id(user_id)) {
            socket.join(user_id); // We are using room of socket io
            funUpdateUserOnlineStatus(user_id, 1);
            user_connection_tmp1[0] = user_id;
            user_connection_tmp1[1] = Date.now();
            user_connection_tmp1[2] = socket.id;
        }
    })
    socket.on("massege", function (data) {
        console.log("massege is arrive:", data);
    })
});