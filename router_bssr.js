
const express = require("express");
const router_bssr = express.Router();
const restaurantController = require("./controllers/restaurantController");

/*************************
 *      BSSR EJS         *
 ************************/
router_bssr.get("/signup", restaurantController.getSignupMyRestaurant); //signup qilinganda qandaydir faylga oborishi uchun get ishlatildi yani signup
router_bssr.post("/signup", restaurantController.signupProcess);        //qilinganda post qilish bilan birga get orqali signup.ejs file ga boradi

router_bssr.get("/login", restaurantController.getLoginMyRestaurant);
router_bssr.post("/login", restaurantController.loginProcess);

router_bssr.get("/logout", restaurantController.logout);

module.exports = router_bssr; 