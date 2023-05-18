const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const dotenv = require("dotenv");
const { resolve } = require("path");
const { rejects } = require("assert");
dotenv.config({ path: "./.env" });

var url = "mongodb://localhost:27017/";

var mainDb;
var dbo;
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  mainDb = db;
  dbo = mainDb.db("massenger");
});

exports.login = async (req, res) => {
  const credential = req.body.credential;
  console.log("credential:", credential);
  Login(credential, req, res);
};

async function Login(credential, req, res) {
  
  //check user is already login or not
  const findUser = await dbo
    .collection("login_info")
    .findOne({ email: credential.email });

  // if login send response else register forst and than send response
  if (findUser != null) {
    const user_key = findUser._id;
    const token = jwt.sign({ user_key }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    console.log("The token is: " + token);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: false,
    };
    /* res.cookies("jwt", token, cookieOptions);*/

    const contact = await dbo
      .collection("user_info")
      .findOne({ _id: ObjectId(findUser._id) });

    const response = {
      status: 1,
    };

    if (contact == null) {
      response["data"] = [];
    } else {
      response["data"] = contact.ContactsEmails;
    }

    console.log("ContactEmails : ", response);
    res.status(200).send({ status: 1, token, data: findUser, Contacts: contact });
    
    return;
  } else {
    Register(credential, req, res)
      .then((response) => {
        Login(credential, req, res);
      })
      .catch((err) => {
        console.log("error accure in catch while register  :", err);
      });
  }
}

async function Register(credential, req, res) {
  var myobj = {
    username: credential.name,
    email: credential.email,
    picture: credential.picture,
    about: "hey there, i am using massenger!",
  };

  const result = await dbo.collection("login_info").insertOne(myobj);
  if (result) {
    console.log("Register result is : ", result);
    const result1 = await dbo.collection("user_info").insertOne({
      _id: ObjectId(result.insertedId),
      about: "hey there, i am using massenger!",
      ContactsEmails: [],
    });
    const result2 = await dbo.collection("masseges").insertOne({
      _id: ObjectId(result.insertedId),
      Contacts: [],
    });
    resolve("1");
  } else {
    rejects("0");
  }
}

// exports.isLoggedIn = async (req, res, next) => {
//   // console.log(req.cookies);
//   if (req.cookies.jwt) {
//     try {
//       //1) verify the token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET
//       );
//       // console.log(decoded);
//       //2) Check if the user still exists
//       con.query(
//         "SELECT * FROM users_details WHERE user_key = ?",
//         [decoded.user_key],
//         (error, result) => {
//           // console.log(result);
//           if (!result) {
//             req.isloggedin = 2;
//             console.log("enter in not result");
//             return next();
//           }

//           req.user = result[0];
//           // console.log("user is", req.user);
//           console.log("user is", decoded.user_key);
//           if (decoded.user_key) {
//             console.log("enter in exist login condition");
//             req.isloggedin = 1;
//             req.user_key = decoded.user_key;
//             return next();
//           } else {
//             req.isloggedin = 0;
//             res.redirect("/login");
//             console.log("enter in undefined userkey cndition ");
//             //  res.redirect("/login");
//             var data = [];
//             data["message"] = 4;
//             res.render("auth/login.ejs", { data });
//           }
//         }
//       );
//     } catch (error) {
//       req.isloggedin = 0;
//       console.log("enter in catch error ");
//       // console.log(error);
//       var data = [];
//       data["message"] = 4;
//       res.render("auth/login.ejs", { data });
//     }
//   } else {
//     console.log("enter in cookiei not set  condition ");
//     req.isloggedin = 0;
//     var data = [];
//     data["message"] = "4";
//     res.render("auth/login.ejs", { data });
//   }
// };

// exports.logout = async (req, res) => {
//   res.cookie("jwt", "logout", {
//     expires: new Date(Date.now()), //Date.now()+ 2 * 1000// some jwt error in this
//     httpOnly: true,
//   });
//   res.status(200).redirect("/");
// };
