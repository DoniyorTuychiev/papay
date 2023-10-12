console.log("web Serverni boshlash");

const express = require("express");
const app = express();

//MongoDB chaqirish
const db = require("./server").db(); 
const mongodb = require("mongodb");

//1 - kirishCode
app.use(express.static("public"));
app.use(express.json()); 
app.use(express.urlencoded ({extended: true})); 

// 2- sessionCode

//3 - ViewsCode

app.set("views", "views"); 
app.set("view engine", "ejs"); 

//4 Routing Code 

module.exports = app;