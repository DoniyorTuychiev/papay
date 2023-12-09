const mongoose = require("mongoose");
const {order_status_enums} = require("../lib/config");
const Schema = mongoose.Schema;

const orderItemSchema = new mongoose.Schema(
    {
    item_quentity: {
        type: Number, //typeof ema type tori typofda xatolik qaytadi. shuning uchun type ga ozgartirdim
        required: true,

    },
    item_price: {
        type: Number,
        required: true,
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: false,
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: false,
    },

}, {timestamps: true}); //createdAT & updatedAT
     
    module.exports = mongoose.model("OrderItem", orderItemSchema);// Bu yerda ham Schema deyish orniga Schima deb qoyipman 2 1 soat xato qidirdim