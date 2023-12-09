const Order= require("../models/Order");
const assert = require("assert");
const Definer = require("../lib/mistake");

let orderController = module.exports;


/**createOrder section start */
orderController.createOrder = async (req, res) => {
  try{
    console.log("POST: cont/createOrder");
    assert.ok(req.member, Definer.auth_err5);
    
    const order = new Order();
    const result = await order.createOrderData(req.member, req.body);
    
    

    res.json({static:"succeed", data: result}); 
  }catch(err){
          console.log(`ERROR, cont/createOrder, ${err.message}`);
          res.json({state: "fail", message: err.message});
  }
};
/**createOrder section finesh */


orderController.getMyOrders = async (req, res) => {
  try{
    console.log("POST: cont/getMyOrders");
    assert.ok(req.member, Definer.auth_err5);

    const order = new Order();

    const result = await order.getMyOrdersData(req.member, req.query);

    res.json({static:"succeed", data: result}); 
  }catch(err){
          console.log(`ERROR, cont/getMyOrders, ${err.message}`);
          res.json({state: "fail", message: err.message});
  }
};