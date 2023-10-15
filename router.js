
const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");

//Membersga Daxildor
router.get("/", memberController.home);
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);

//boshqa routerlar
router.get("/menu", (req, res) => {
    res.send("menu sahifasidasiz");
});

router.get("/community", (req, res) => {
    res.send("community sahifasidasiz");
});

module.exports = router; 