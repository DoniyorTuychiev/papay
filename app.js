console.log("web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router.js");
const router_bssr = require("./router_bssr.js");

//1 - kirishCode
app.use(express.static("public"));
app.use(express.json()); 
app.use(express.urlencoded ({extended: true})); 

// 2- sessionCode

//3 - ViewsCode

app.set("views", "views"); 
app.set("view engine", "ejs"); 

//4 Routing Code 
// app.use("/resto", router_bssr); //resto FrontendAplication Adminlar va RestoranUserlari uchun kerak boladi
app.use("/resto", router_bssr)
app.use("/", router);// Bu frontent aplication esa xaridorlar uchun kerak

module.exports = app; 