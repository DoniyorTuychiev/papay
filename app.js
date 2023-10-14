console.log("web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router.js")

//1 - kirishCode
app.use(express.static("public"));
app.use(express.json()); 
app.use(express.urlencoded ({extended: true})); 

// 2- sessionCode

//3 - ViewsCode

app.set("views", "views"); 
app.set("view engine", "ejs"); 

//4 Routing Code 
app.use("/", router);

module.exports = app; 