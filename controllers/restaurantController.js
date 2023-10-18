const Member = require("../models/Member");

let restaurantController = module.exports;

restaurantController.getSignupMyRestaurant = async (req, res) => {
  console.log("Hi I am here");
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
    res.json({static:"succeed", data: new_member}); 

  }catch(err){
          console.log(`ERROR, cont/signup, ${err.message}`);
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
    console.log(`GET: cont/getLoginMyRestaurant, ${err.message}`);
    res.json({state: "fail", message: err.message});
  }
}

restaurantController.loginProcess = async (req, res) => {
        try{
          console.log("POST: cont/login");
          const data = req.body,
          member = new Member(),
          result = await member.loginData(data);
         
          res.json({ static:"succeed", data: result }); 
        }catch(err){
                console.log(`ERROR, cont/login, ${err.message}`);
                res.json({state: "fail", message: err.message});
        }
      };
/**login section finesh */
/**logout section start */
restaurantController.logout = (req, res) => {
        console.log("GET const.logout");
        res.send("logout sahifasidasiz");
};
/**logout section finesh */
