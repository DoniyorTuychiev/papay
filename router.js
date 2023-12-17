const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const restaurantController = require("./controllers/restaurantController");
const productController = require("./controllers/productController");
const orderController = require("./controllers/orderController");
const communityController = require("./controllers/communityController");
const followController = require("./controllers/followController");
const uploader_community = require("./utils/upload-multer")("community");
const uploader_member = require("./utils/upload-multer")("members");
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

router.post("/member-liken", 
memberController.retrieveAuthMember,
memberController.likeMemberChosen
);


//boshqa routerlar
router.post(
  "/products", //router da n point bu url yani "/products" boladi
  memberController.retrieveAuthMember,
  productController.getAllProducts
);

router.get(
  "/products/:id",
  memberController.retrieveAuthMember,
  productController.getChosenProduct
);

//Order related routers

router.post(
  "/orders/create",
  memberController.retrieveAuthMember,
  orderController.createOrder
);

router.get(
  "/orders",
  memberController.retrieveAuthMember,
  orderController.getMyOrders
);

//*develop EditChosenOrder api business logic by_79*
router.post(
  "/orders/edit",
  memberController.retrieveAuthMember,
  orderController.editChosenOrder
);

//*Community related router
router.post(
  "/community/image",
  uploader_community.single("community_image"),
  communityController.imageInsertion
);

router.post(
  "/community/create",
  memberController.retrieveAuthMember,
  communityController.createArticle
);

router.get(
  "/community/articles",
  memberController.retrieveAuthMember,
  communityController.getMemberArticles
);

router.get(
  "/community/target",
  memberController.retrieveAuthMember,
  communityController.getArticles
);

router.get(
  "/community/single-article/:art_id",
  memberController.retrieveAuthMember,
  communityController.getChosenArticle
);

//*Following releted routers

router.post(
  "/follow/subscribe",
  memberController.retrieveAuthMember,
  followController.subscribe
);

router.post(
  "/follow/unsubscribe",
  memberController.retrieveAuthMember,
  followController.unsubscribe
);

router.get(
  "/follow/followings",
  followController.getMemberfollowings
);

router.get(
  "/follow/followers",
  memberController.retrieveAuthMember,
  followController.getMemberFollowers
);
/********************************* */
router.get("/menu", (req, res) => {
  res.send("menu sahifasidasiz");
});

router.get("/community", (req, res) => {
  res.send("community sahifasidasiz");
});

//Restaurants related routers

router.get(
  "/restaurants",
  memberController.retrieveAuthMember,
  restaurantController.getRestaurants
);

router.get(
  "/restaurants/:id",
  memberController.retrieveAuthMember,
  restaurantController.getChosenRestaurant
);

module.exports = router;
