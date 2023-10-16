const Member = require("../models/Member");

let memberController = module.exports;

/**signup section start */
memberController.signup = async (req, res) => {
  try{
    console.log("POST: cont/signup");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);

    res.json({static:"succeed", data: new_member}); 
  }catch(err){
          console.log(`ERROR, cont/signup, ${err.message}`);
          res.json({state: "fail", message:err.message});
  }
};
/**signup section finesh */
/**login section start */

memberController.login = async (req, res) => {
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
memberController.logout = (req, res) => {
        console.log("GET const.logout");
        res.send("logout sahifasidasiz");
};
/**logout section finesh */
