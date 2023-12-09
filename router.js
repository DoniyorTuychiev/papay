
const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const restaurantController = require("./controllers/restaurantController");
const productController = require("./controllers/productController");
const orderController = require("./controllers/orderController");
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
router.post("/products", //router da n point bu url yani "/products" boladi
    memberController.retrieveAuthMember,
    productController.getAllProducts);

router.get("/products/:id", 
    memberController.retrieveAuthMember,
    productController.getChosenProduct);

router.get("/restaurants/:id", 
    memberController.retrieveAuthMember,
    restaurantController.getChosenRestaurant);

//Order related routers

router.post(
    "/orders/create",
    memberController.retrieveAuthMember,
    orderController.createOrder,
);


/********************************* */
router.get("/menu", (req, res) => {
    res.send("menu sahifasidasiz");
});

router.get("/community", (req, res) => {
    res.send("community sahifasidasiz");
});        

//Restaurants related routers

router.get("/restaurants", 
    memberController.retrieveAuthMember,
    restaurantController.getRestaurants,);

module.exports = router; 