const OrderModel = require("../schema/order.model");
const OrderItemModel = require("../schema/order_item.model");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");

class Order {
  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }

  async createOrderData(member, data) {
    try {
      let order_total_amount = 0,
        delivery_cost = 0;

      const mb_id = shapeIntoMongooseObjectId(member?._id);

      data.map((item) => {
        order_total_amount += item["quantity"] * item["price"];
      });
      if (order_total_amount < 100) {
        delivery_cost = 2;
        order_total_amount += delivery_cost;
      }

      const order_id = await this.saveOrderData(
        order_total_amount,
        delivery_cost,
        mb_id
      );

      await this.recordOrderItemsData(order_id, data);

      return order_id;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderData(order_total_amount, delivery_cost, mb_id) {
    try {
      const new_order = new this.orderModel({
        order_total_amount: order_total_amount,
        order_delivery_cost: delivery_cost,
        mb_id: mb_id,
      });
      const result = await new_order.save();
      assert.ok(result, Definer.order_err1);

      return result._id;
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err1);
    }
  }

  async recordOrderItemsData(order_id, data) {
    try {
      const pro_list = data.map(async (item) => {
        return await this.saveOrderItemsData(item, order_id);
      });
      const results = await Promise.all(pro_list); //pro_listda hammasini bajarilishini majbur qiluvchi mantiq Promis.all() har bir asyc method lar bajarilgach keyingisiga otishga majbur qiladi
      console.log("results:::", results);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderItemsData(item, order_id) {
    try {
      order_id = shapeIntoMongooseObjectId(order_id);
      item._id = shapeIntoMongooseObjectId(item._id);

      const order_item = new this.orderItemModel({
        item_quantity: item["quantity"],
        item_price: item["price"],
        order_id: order_id,
        product_id: item["_id"],
      });
      const result = await order_item.save();
      assert.ok(result, Definer.auth_err2);

      return "created";
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err2);
    }
  }

  ///////////////////////////

  async getMyOrdersData(member, query) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id);
      const order_status = query.status.toUpperCase();
      const matches = { mb_id: mb_id, order_status: order_status };

      const result = await this.orderModel
        .aggregate([
          { $match: matches },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {                  //*bu qismda("orderitems") db dagi collection nomi qanday bolsa shunde yoziladi
              from: "orderitems",       //0 matches orqali hosil bolgan myorders array ni orders collectiondan izla va
              localField: "_id",        //1)uni ichidagi buyurtma raqamim yani _id ga teng bolgan maxsulotlarni
              foreignField: "order_id", //2) orderitems collection buyurtma qilingan maxsulotdagi order_idsiga teng bolganlarini
              as: "order_items",        //4)"order_items" nomi ostiga olib ber(bu nom ixtiyoriy)
            },                          //1) mb_id(logined) => mb_id(orders ichidagi)   2) _id (orders ichidagi) => order_id (orderitems ichidagi)
          },
          {
            $lookup: {
              from: "products",         //*bu qismda db dagi collection nomi qanday bolsa shunde yoziladi
              localField: "order_items.product_id",
              foreignField: "_id",
              as: "product_data",
            },
          },
        ])
        .exec();
      console.log("result:::", result);

      return result;
    } catch (err) {
      throw err;
    }
  }

  //*develop EditChosenOrder api business logic by_79*
  async editChosenOrderData(member, data) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id),
        order_id = shapeIntoMongooseObjectId(data.order_id),
        order_status = data.order_status.toUpperCase();

      const result = await this.orderModel
        .findByIdAndUpdate(
          { mb_id: mb_id, _id: order_id },
          { order_status: order_status },
          {
            runValidators: true,
            lean: true, //bu yerda lean:true yzoilmasayam code ishledi lekin boshqa parametr  qoshib bolmaydi
            returnDocument: "after",
          }
        )
        .exec();
      console.log("result:::", result);

      assert.ok(result, Definer.auth_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Order;
