const LikeModel = require("../schema/like.model");
const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");
const BoArticleModel = require("../schema/bo_article.model");

class Like {
  constructor(mb_id) {
    this.likeModel = LikeModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.boArticleModel = BoArticleModel;
    this.mb_id = mb_id;
  }

  async validateChosenTargetItem(like_ref_id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findOne({ _id: like_ref_id, mb_status: "ACTIVE" })
            .exec();
          break;
        case "product":
          result = await this.productModel
            .findOne({ _id: like_ref_id, product_status: "PROCESS" })
            .exec();
          break;
        case "community":
        default:
          result = await this.boArticleModel
            .findOne({ _id: like_ref_id, art_status: "active" })
            .exec();
          break;
      }
      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async checkLikeExistence(like_ref_id) {
    try {
      const like = await this.likeModel
        .findOne({ mb_id: this.mb_id, like_ref_id: like_ref_id })
        .exec();
      return !!like;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Like;
