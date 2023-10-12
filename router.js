//Routlar
//Routlar clientdan req olib controllerga jonatadi va quydagi ketma-ketlikda res oladi
/* 1) client => 2) Controller => 3) Model => 
4) DaraBase#####RESPONSE from dataBase to back##### 5) DataBase=> 
4) Model => 3) Controller => 2) View  #### Datani olib html ni quradi va Controllerga qaytaradi 
1) View => 0) Controller => Client(res keladi) 
*/

const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    res.send("home sahifasidasiz");
});

router.get("/menu", (req, res) => {
    res.send("menu sahifasidasiz");
});

router.get("/community", (req, res) => {
    res.send("community sahifasidasiz");
});

module.exports = router;