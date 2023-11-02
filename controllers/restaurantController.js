
const Member = require("../models/Member");
const Product = require("../models/Product");

let restaurantController = module.exports;
restaurantController.home = async (req, res) => {
  try{
    console.log("GET: cont/home");
    res.render("home-page");
  }catch(err){
    console.log(`GET: cont/home, ${err.message}`);
    res.json({state: "fail", message: err.message});
  }
}
restaurantController.getMyRestaurantProducts = async (req, res) => {
  try{
    console.log("GET: cont/getMyRestaurantProducts");
    //TODI: "Get My Restaurant Products"
    const product = new Product();
    const data = await product.getAllProductsDataResto(res.locals.member);
    //console.log("data:", data); qilinsa MongoDB dagi type i restaurant bolgan meberlar malumotini qaytishini korish mumkin
    res.render("restaurant-menu", {restaurant_data: data});//restarantga tegishli bolgan datani restaurant_data: ga save qilib
                                                          //"restauran-menu".ejsi ga yuborilyapti
  }catch(err){
    console.log(`GET: cont/getAllProductsDataResto, ${err.message}`);
    res.json({state: "fail", message: err.message});
  }
}
restaurantController.getSignupMyRestaurant = async (req, res) => {
  
  try{
    console.log("GET: cont/getSignupMyRestaurant");
    res.render("signup");
  }catch(err){
    console.log(`GET: cont/getSignupMyRestaurant, ${err.message}`);
    res.json({state: "fail", message: err.message});
  }
}
/**signup section start */
restaurantController.signupProcess = async (req, res) => {
  try{
    console.log("POST: cont/signup");
    const data = req.body,
    member = new Member(),
    new_member = await member.signupData(data);
    //SESSION
    req.session.member = new_member; //1-vazifasi mongo db da session qismiga malumotni yozib qoyish
                                    //2-vazifasi cooke ga id nomerlarini kiritip qoyish
    res.redirect("/resto/products/menu");
  }catch(err){
          console.log(`ERROR: cont/signupProcess, ${err.message}`);
          res.json({state: "fail", message: err.message});
  }
};
/**signup section finesh */
/**login section start */
restaurantController.getLoginMyRestaurant = async (req, res) => {
  try{
    console.log("GET: cont/getLoginMyRestaurant");
    res.render("login-page");
  }catch(err){
    console.log(`ERROR: cont/getLoginMyRestaurant, ${err.message}`);
    res.json({state: "fail", message: err.message});
  }
}
restaurantController.loginProcess = async (req, res) => {
        try{
          console.log("POST: cont/login");
          const data = req.body,
            member = new Member(), 
            result = await member.loginData(data);
            req.session.member = result;
            req.session.save(function() {
              result.mb_type ==="ADMIN"//agar resultdagi mb ni type "ADMIN" bolsa "/resto/all-restaurant" ga yubor boshqa bolsa ("/resto/products/menu")
              ? res.render("/resto/all-restaurant")
              : res.redirect("/resto/products/menu");
            });
        }catch(err){
                console.log(`ERROR, cont/loginProcess, ${err.message}`);
                res.json({state: "fail", message: err.message});
        }
      };
       /**logout section start */
restaurantController.logout = (req, res) => {
  console.log("GET const.logout");
  res.send("logout sahifasidasiz");
};
/**logout section finesh */
/**validateAuthRestaurant section finesh */
restaurantController.validateAuthRestaurant = (req, res, next) => {
  if(req.session?.member?.mb_type === "RESTAURANT") {
    req.member = req.session.member;
    next();
   }else
     res.json({state: "fail", message: "only authenticated members with restaurant type"});
  }
  //check_me start
restaurantController.checkSessions = (req, res) => {
  if(req.session?.member) {
    res.json({state: "succeed", data: req.session.member});
  }else{
    res.json({state: "fail", message: "you are not authenticated"});
  }
};