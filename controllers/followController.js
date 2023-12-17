let followController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");
const Follow = require("../models/Follow");

followController.subscribe = async (req, res) => {
  try {
    console.log("POST: cont/subscribe");
    assert.ok(req.member, Definer.auth_err5);

    const follow = new Follow();
    await follow.subscribeData(req.member, req.body);

    res.json({ static: "succeed", data: "subscribed" });
  } catch (err) {
    console.log(`ERROR, POST: cont/subscribe, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

followController.unsubscribe = async (req, res) => {
  try {
    console.log("POST: cont/unsubscribe");
    assert.ok(req.member, Definer.auth_err5);

    const follow = new Follow();
    await follow.unsubscribeData(req.member, req.body);

    res.json({ static: "succeed", data: "unsubscribed" });
  } catch (err) {
    console.log(`ERROR, POST: cont/unsubscribe, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

followController.getMemberfollowings = async (req, res) => {
  try{
    console.log("GET: cont/getMemberfollowings");
    const follow = new Follow();
    const result = await follow.getMemberfollowingsData(req.query);

    res.json({ static: "succeed", data: result });
  }catch(err){
    console.log(`ERROR, GET: cont/getMemberfollowings, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}

followController.getMemberFollowers = async (req, res) => {
  try{
    console.log("GET: cont/getMemberFollowers");
    const follow = new Follow();
    const result = await follow.getMemberFollowersData(req.member, req.query);

    res.json({ static: "succeed", data: result });
  }catch(err){
    console.log(`ERROR, GET: cont/getMemberFollowers, ${err.message}`);
    res.json({ state: "fail", message: err.message })
  }
}
