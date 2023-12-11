const Order = require("../models/Order");
const assert = require("assert");
const Definer = require("../lib/mistake");

let orderController = module.exports;

/**createOrder section start */
orderController.createOrder = async (req, res) => {
  try {
    console.log("POST: cont/createOrder");
    assert.ok(req.member, Definer.auth_err5);

    const order = new Order();
    const result = await order.createOrderData(req.member, req.body);

    res.json({ static: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
/**createOrder section finesh */

orderController.getMyOrders = async (req, res) => {
  try {
    console.log("GET: cont/getMyOrders");
    assert.ok(req.member, Definer.auth_err5);

    const order = new Order();
    const result = await order.getMyOrdersData(req.member, req.query);
    //bu yerda req.member => login bolgan mb_id,mb_nick,mb_type chiqadi; query => {status: "paused"} ga teng boladi
    res.json({ static: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getMyOrders, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

// orderController.editChosenOrder = async (req, res) => {
//   try{
//     console.log("GET: cont/editChosenOrder");
//     assert.ok(req.member, Definer.auth_err5);
    
//     const order = new Order();
//     const result = await order.editChosenOrderData (req.member, req.body);
    
//     res.json({ static: "succeed", data: result });
//   }catch(err){
//     console.log(`ERROR, cont/editChosenOrder, ${err.message}`);
//     res.json({ state: "fail", message: err.message });
//   }
// };

