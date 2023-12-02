
const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");

/*************************
 *      REST API         *
 ************************/
//Membersga Daxildor

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
    "/member/:id",
    memberController.retrieveAuthMember, //ikkita methodni ga kirishda orasida vergul qoyiladi nuqta emas
    memberController.getChosenMember
    );

//boshqa routerlar
router.get("/menu", (req, res) => {
    res.send("menu sahifasidasiz");
});

router.get("/community", (req, res) => {
    res.send("community sahifasidasiz");
});        

module.exports = router; 