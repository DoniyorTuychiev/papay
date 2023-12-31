console.log("web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router.js");
const router_bssr = require("./router_bssr.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//session ni yarataish
let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});
//session ni yarataish yakunlandi

//1 - kirishCode
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded ({extended: true}));//Bu comment bop qoganiga login.ejs fromdan input qabul qimadi
app.use(
  cors({
  credentials: true,
  origin: true      //har qanday domennidan kelyotgan reqni qabul qil manosi.postmanda bolmasligini sababi undan bu hususiyat yechilgan
})
);
app.use(cookieParser()); //cookieParser ni ishlatish cookie ichidan access_tokenni ajratib olishga ruxsat beradi


// 2- sessionCode

//yaratilgan sessiondan foydalanish
app.use(
  session({
    secret: process.env.SESSION_SECRET, //secret ni hosil qilamiz bu encoding va decoding uchun yordam beradi
    cookie: {
      //yani session id ni encode& decode qilibturadi
      maxAge: 1000 * 60 * 30,
    },
    store: store,
    resave: true, //resave: true; bu cookeni har safar kirilganda yangilap turadi
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.member = req.session.member;
  next();
});

//3 - ViewsCode

app.set("views", "views");
app.set("view engine", "ejs");

//4 Routing Code

app.use("/resto", router_bssr); //BSSR yani tradetional
app.use("/", router); // Bu frontent aplication esa xaridorlar uchun kerak REACT uchun

module.exports = app;
