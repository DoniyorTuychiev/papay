const BoArticleModel = require("../schema/bo_article.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Community {
  constructor() {
    this.boArticleModel = BoArticleModel;
  }

  async createArticleData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);
      const new_article = await this.saveArticleData(data);
      console.log("New_Article:::", new_article);
      return new_article;
    } catch (err) {
      throw err;
    }
  }

  async saveArticleData(data) {
    try {
      const article = new this.boArticleModel(data);
      return await article.save();
    } catch (mongo_err) {
      console.log("Mongo_err:::", mongo_err);
      throw new Error(Definer.auth_err1);//agar bu yerda new mongo db err hosil qilmaganimizda postmandan kiritilgan celebrety  "message": "att: mongodb validation is failed!" ni ololmasdim. Mdb celebrety emas celebrity deb yozilgan enumda
    }
  }
}

module.exports = Community;
