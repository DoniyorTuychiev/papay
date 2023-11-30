const assert = require("assert");
const Member = require("../models/Member");
const cookieParser = require("cookie-parser");

let memberController = module.exports;

const jwt = require("jsonwebtoken");
const Definer = require("../lib/mistake");

/**signup section start */
memberController.signup = async (req, res) => {
  try{
    console.log("POST: cont/signup");
    const data = req.body,
    member = new Member(),
    new_member = await member.signupData(data);

    const token = memberController.createToken(new_member);
    //token qismi
    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000, 
      httpOnly: true,
    });

    res.json({static:"succeed", data: new_member}); 
  }catch(err){
          console.log(`ERROR, cont/signup, ${err.message}`);
          res.json({state: "fail", message: err.message});
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
          console.log(result);
          const token = memberController.createToken(result);
          console.log("this is token:", token);

          res.cookie("access_token", token, {
            maxAge: 6 * 3600 * 1000, 
            httpOnly: true,
          });
         
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

memberController.createToken = (result) => {
  try{
    const upload_data = {
      _id: result._id,
      mb_nick: result.mb_nick,
      mb_type: result.mb_type
    };

    const token = jwt.sign(upload_data, process.env.SECRET_TOKEN, {
      expiresIn: "6h",
    });

    assert.ok(token, Definer.auth_err4);
    return token;
  }catch(err){
    throw err;
  }
}