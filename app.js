console.log("web Serverni boshlash");
const http = require("http");
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
app.use(express.urlencoded({ extended: true })); //Bu comment bop qoganiga login.ejs fromdan input qabul qimadi
app.use(
  cors({
    credentials: true,
    origin: true, //har qanday domennidan kelyotgan reqni qabul qil manosi.postmanda bolmasligini sababi undan bu hususiyat yechilgan
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


/** SOCKET.IO */
                                        // socket.emit();           //? Faqat unga
                                        // socket.broadcast.emit(); //? Undan boshqa hammaga
                                        // io.emit();               //? HAMMAGA
const server = http.createServer(app);
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["websoket", "xhr-polling"],
});
let online_users = 0;
io.on("connection", function (socket) {
  online_users++;
  console.log("New user, total:", online_users);
  socket.emit("greetMsg", { text: "Welcome" });
  io.emit("infoMsg", { total: online_users });

  socket.on("disconnect", function () {
    online_users--;
    socket.broadcast.emit("infoMsg", { total: online_users });
    console.log("client disconnected, total", online_users);
  });

  socket.on("creatMsg", function (data) {
    console.log(data);
    io.emit("newMsg", data); //?Bu qatorda men yangi yozgan massege hammaga boradi menga ham 
  });                        //?shu tartibda ozimgaham massegimni jonatmasam yozaveraman lekin koraolmiman

});

module.exports = server;
