
console.log("web Serverni boshlash");
const express = require("express");
const app = express();

const db = require("./server").db(); 
const mongodb = require("mongodb");

app.use(express.static("public"));
app.use(express.json()); 
app.use(express.urlencoded ({extended: true})); 

app.set("views", "views"); 
app.set("view engine", "ejs"); 

//4 Routing Code 

// app.post("/create-item", (req, res) => {  

//     console.log(req.body); 
//     res.json({test:"success"}); 
// });

// app.get('/', function(req, res){ 
//     res.render("reja");
// });

module.exports = app;