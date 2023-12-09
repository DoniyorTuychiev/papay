const mongoose = require("mongoose");
const {} = require("../lib/config");
const { ObjectId } = require("mongodb");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
    {
    order_total_amount: {
        typeof: Number,
        required: true,
    },
    order_delivery_cost: {
        typeof: Number,
        required: true,
    },
    order_status: {
        typeof: Number,
        required: false,
        enum: {
            values: order_status_enums,
            message: "{VALUE}   is not among permitted enum values!",
        }
    },
    mb_id: {
        type: Schema.Types.ObjectId,
        ref: "Member", 
        required: false,
    }
},
    {timestamps: {createdAt: true}}
);

module.exports = mongoose.model("Order", orderSchema);