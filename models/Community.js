const BoArticleModel = require("../schema/bo_article.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  board_id_enum_list,
} = require("../lib/config");
const Member = require("./Member");

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
      throw new Error(Definer.mongo_validation_err1); //agar bu yerda new mongo db err hosil qilmaganimizda postmandan kiritilgan celebrety  "message": "att: mongodb validation is failed!" ni ololmasdim. Mdb celebrety emas celebrity deb yozilgan enumda
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
              from: "members", //*bu qismda db dagi collection nomi qanday bolsa shunde yoziladi
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" }, //*{$unwind: '$member_data'} => buni yozish mb_data ni ichida arr bolishi shart emas chunki mb_datani mb_collectiondan olip kelinyapti
          //todo: chech auth member liked the chosen target
        ]) //*shuning uchun bitta object boladigan err ni ichidagi object ni olib toridan-tori mb_data qiymatiga qoyib berilishini tamanlaydi
        .exec();
      assert.ok(result, Definer.article_err2);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getMemberArticlesData(member, inquery) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let matches =
        inquery.bo_id === "all"
          ? { bo_id: { $in: board_id_enum_list }, art_status: "active" }
          : { bo_id: inquery.bo_id, art_status: "active" };
      inquery.limit *= 1;
      inquery.page *= 1;

      const sort = inquery.order
        ? { [`${inquery.order}`]: -1 }
        : { createdAt: -1 };

      const result = await this.boArticleModel
        .aggregate([
          { $match: matches },
          { $sort: sort },
          { $skip: (inquery.page - 1) * inquery.limit },
          { $limit: inquery.limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          //todo: chech auth member liked the chosen target
        ])
        .exec();

      console.log("result:::", result);
      assert.ok(result, Definer.article_err3);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenArticleData(member, art_id) {
    try {
      art_id = shapeIntoMongooseObjectId(art_id);

      //*increse art views when user has not seen before
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, art_id, "community");
      }

      const result = await this.boArticleModel
      .findById({ _id: art_id })
      .exec();
      assert.ok(result, Definer.article_err3);

      console.log("result:::", result);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;
