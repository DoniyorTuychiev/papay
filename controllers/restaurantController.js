
const Member = require("../models/Member");
const Product = require("../models/Product");
const Definer = require("../lib/mistake");
const Restaurant = require("../models/Restaurant");
const assert = require("assert"); 


let restaurantController = module.exports ;

restaurantController.getRestaurants = async (req, res) => {
  try{
    console.log("GET: cont/getRestaurants");
    const data = req.query;// req.query bu linkda keluvchi soroqdan keyin keluvchi req lardir Ex: order, mb_nick ...
    const restaurant = new Restaurant();
    const result = await restaurant.getRestaurantsData(req.member, data);

   res.json({ state: "success", data: result}); 
  }catch(err){
    console.log(`GET: cont/getRestaurants, ${err.message}`);
    res.json({state: "fail", message: err.message});
  }
}

restaurantController.getChosenRestaurant = async (req, res) => {
  try{
    console.log(`GET: const/getChosenREstaurant`);
    const 
      id = req.params.id,
      restaurant = new Restaurant(),
      result = await restaurant.getChosenRestaurantData(req.member, id);

   res.json({ state: "success", data: result}); 
  }catch(err){
    console.log(`GET: cont/getChosenRestaurant, ${err.message}`);
    res.json({state: "fail", message: err.message});
  }
}

/*****************************************
 *    BSSR RELADETMETHOD FOR ADMINKA     *
 *****************************************/

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
    console.log(`ERROR: cont/getAllProductsDataResto, ${err.message}`);
    res.redirect("/resto");
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

    console.log("POST: cont/signupProcess");
    assert(req.file, Definer.general_err3);

    const new_member = req.body;
    new_member.mb_type = "RESTAURANT";
    new_member.mb_image = req.file.path;

    const member = new Member();
    const result = await member.signupData(new_member);
    assert(result, Definer.general_err1);
    
      //SESSION
    req.session.member = result; //1-vazifasi mongo db da session qismiga malumotni yozib qoyish
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
              ? res.redirect("/resto/all-restaurants") 
              : res.redirect("/resto/products/menu");
            });
        }catch(err){
                console.log(`ERROR, cont/loginProcess, ${err.message}`);
                res.json({state: "fail", message: err.message});
        }
      };
       /**logout section start */
restaurantController.logout = (req, res) => {
  try{
    console.log("GET cont/logout");
    req.session.destroy(function() {
      res.redirect("/resto");
    });
  }catch{
    console.log(`ERROR, cont/logout, ${err.message}`);
    res.json({state:"fail", message: err.message});
  }
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

restaurantController.validateAdmin = (req, res, next) => {
  if(req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
   }else{
     const html = `<script>
       alert("Admin page: Permission demind!");
       window.location.replace('/resto');
       </script>`;
       res.end(html);
   } 
  };

restaurantController.getAllRestaurants = async (req, res) => {
  try{
    console.log("GET cont/getAllRestaurants"); 
    const restaurant = new Restaurant();
    const restaurants_data = await restaurant.getAllRestaurantsData();
    res.render("all-restaurants", { restaurants_data: restaurants_data});
  }catch(err){
    console.log(`ERROR, cont/getAllRestaurants, ${err.message}`);
    res.json({state:"fail", message: err.message});    
  }
}

restaurantController.updateRestaurantByAdmin = async (req, res) => {
  try{
    console.log("GET cont/updateRestaurantByAdmin");
    const restaurant = new Restaurant();
    const result = await restaurant.updateRestaurantByAdmin(req.body);

    await res.json({state: "success", data: result});
  }catch(err){
    console.log(`ERROR, cont/updateRestaurantByAdmin, ${err.message}`);
    res.json({state:"fail", message: err.message});    
  } 
}
 