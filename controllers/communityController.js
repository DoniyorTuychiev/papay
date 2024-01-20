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

communityController.getMemberArticles = async (req, res) => {
  try {
    console.log("GET: cont/getMemberArticles");
    const community = new Community();

    const mb_id =
      req.query.mb_id !== "none" ? req.query.mb_id : req.member?._id; //*req.member._id => check qilish uchun ? belgisini qoymasak agarda mb logout bolip ketsa 40 qatorga bormay
    console.log("mb_ida:::", mb_id);
    assert.ok(mb_id, Definer.article_err1); //*otolmaydi va null ni qiymatini yani _id ni oqiy olmayapman deb err qaytadi shuning uchun operatsadan oldin mb ni mavjudligi tekshiriladi

    const result = await community.getMemberArticlesData(
      req.member,
      mb_id,
      req.query
    );
    console.log("result:::", result);
    res.json({ static: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getMemberArticleslar, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.getArticles = async (req, res) => {
  try {
    console.log("GET: cont/getArticles");
    assert.ok(req.member, Definer.auth_err3);
    const community = new Community();
    const result = await community.getArticlesData(req.member, req.query);
    
    console.log("result:::", result);
    res.json({ static: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getArticles, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.getChosenArticle = async (req, res) => {
  try{
    console.log("GET: cont/getChosenArticle");
    const art_id = req.params.art_id;

    const community = new Community(),
    result = await community.getChosenArticleData(req.member, art_id);
    
    res.json({ static: "succeed", data: result });
  }catch(err){
    console.log(`ERROR, cont/getChosenArticle, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}
