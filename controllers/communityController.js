const assert = require("assert");
const Definer = require("../lib/mistake");
const Community = require("../models/Community");

let communityController = module.exports;

communityController.imageInsertion = async (req, res) => {
  try {
    console.log("GET: cont/imageInsertion");
    assert.ok(req.member, Definer.auth_err3);
    const image_url = req.file.path;

    res.json({ static: "succeed", data: image_url });
  } catch (err) {
    console.log(`ERROR, cont/imageInsertion, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.createArticle = async (req, res) => {
  try {
    console.log("GET: cont/imageInsertion");

    const community = new Community();
    const result = await community.createArticleData(req.member, req.body);

    res.json({ static: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createArticle, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
