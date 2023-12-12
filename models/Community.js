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
      throw new Error(Definer.auth_err1); //agar bu yerda new mongo db err hosil qilmaganimizda postmandan kiritilgan celebrety  "message": "att: mongodb validation is failed!" ni ololmasdim. Mdb celebrety emas celebrity deb yozilgan enumda
    }
  }

  async getMemberArticlesData(member, mb_id, inquery) {
    try {
    console.log("GET: cont/getMemberArticlesData");

      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const page = inquery["page"] ? inquery["page"] * 1 : 1;
      const limit = inquery["limit"] ? inquery["limit"] * 1 : 5;

      const result = await this.boArticleModel
        .aggregate([
          { $match: { mb_id: mb_id, art_status: "active" } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          {$unwind: '$member_data'},//*{$unwind: '$member_data'} => buni yozish mb_data ni ichida arr bolishi shart emas chunki mb_datani mb_collectiondan olip kelinyapti 
        ])                          //*shuning uchun bitta object boladigan err ni ichidagi object ni olib toridan-tori mb_data qiymatiga qoyib berilishini tamanlaydi
        .exec();
        assert.ok(result, Definer.article_err2);

        return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;
