
const express = require("express");
const router_bssr = express.Router();
const restaurantController = require("./controllers/restaurantController");
const productController = require("./controllers/productController");

/*************************
 *      BSSR EJS         *
 ************************/
router_bssr
    .get("/signup", restaurantController.getSignupMyRestaurant) //signup qilinganda qandaydir faylga oborishi uchun get ishlatildi yani signup
    .post("/signup", restaurantController.signupProcess);        //qilinganda post qilish bilan birga get orqali signup.ejs file ga boradi

router_bssr
    .get("/login", restaurantController.getLoginMyRestaurant)
    .post("/login", restaurantController.loginProcess);
router_bssr.get("/logout", restaurantController.logout);
router_bssr
    .get("/check-me", restaurantController.checkSessions);


router_bssr.get("/products/menu", restaurantController.getMyRestaurantData);
router_bssr.post("/products/create", 
    restaurantController.validateAuthRestaurant,
    productController.addNewProduct);

router_bssr.post("/products/edit/:id",
    productController.updataChosenProduct);


module.exports = router_bssr; 