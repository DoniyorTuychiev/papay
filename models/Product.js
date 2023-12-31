const assert = require("assert");
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const memberModel = require("../schema/member.model");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      let match = { product_status: "PROCESS" };
      if (data.restaurant_mb_id) {
        match["restaurant_mb_id"] = shapeIntoMongooseObjectId(
          data.restaurant_mb_id
        );
        match["product_collection"] = data.product_collection;
      }
      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }   //bu orinda maxsulot narxi boyicha chiqar deyilsa eng arzon narxdan boshlab sort qiladi
          : { [data.order]: -1 }; //boshqa hollarda esa masalan eng yangi deyilganda oxirgi qoshilgandan boshlab -1 oxirida oldiga qarab chiqarip beruvchi j# ni maxsus sintaksisi bu array emas. va bu diynamik objectlar uchun
                                  //datani json formatdan tushunish oson bolgan formatta korish uchun <JSON formatter.com> siteidan foydalanib korish mumkin
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          lookup_auth_member_liked(auth_mb_id),

          //TO DO: check auth member product likes
        ])
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      if (member) {
        const member_ob = new Member();
        await member_ob.viewChosenItemByMember(member, id, "product");
      }

      const result = await this.productModel
        .aggregate([
          //upload qilinganda aggregate updatedan oldingi datani jonatadi keyin update data keladi
          { $match: { _id: id, product_status: "PROCESS" } },
          //TO DO: check auth member product likes
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  /********************************************************************** */

  async getAllProductsDataResto(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.productModel.find({
        restaurant_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addNewProductData(data, member) {
    try {
      data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id);

      const new_product = new this.productModel(data); // productSchema modeldan new_product instance olib unga datani argument sifatida jonatyapmiz
      const result = await new_product.save();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updataChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      //yangilangan datani berish qismi boshlandi
      const result = await this.productModel
        .findOneAndUpdate({ _id: id, restaurant_mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        //yangilangan datani berish qismi tugadi. Agar after orniga before qoyilsa oldingi datani uzatib beradi

        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Product;
