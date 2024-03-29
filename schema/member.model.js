
const mongoose = require("mongoose");
const {
  member_type_enums,
  member_status_enums,
  ordernary_enums,
} = require("../lib/config");

const memberSchema = new mongoose.Schema(
  {
    mb_nick: {
      type: String,
      required: true,                         //
      index: { unique: true, sparse: true }, //ishlatilgan mb_nike ishlatilgan bolsa qayta ishlattirmaydi va ishlatilgan deydi
    },
    mb_phone: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },
    mb_password: {
      type: String,
      required: true,
      select: false, //db ga ulanishda by defolt password ni bermaslik uchun select: false qilindi
    },
    mb_type: {
      type: String,
      required: true,
      default: "USER", // hamma kirgan user default holatda USER bolishi uchun qoyildi
      enum: {
        values: member_type_enums, // kop foydalaniladigan enum lar uchun config.js kerak bolsa chaqirish uchun expotrs qilip qoydik
        message: "{VALUE} is not among permitted values",
      },
    },
    mb_status: {
      type: String,
      required: false,
      default: "ACTIVE",
      enum: {
        values: member_status_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
    mb_description: {
      type: String,
      required: false,
    },
    mb_address: {
      type: String,
      required: false,
    },
    mb_image: {
      type: String,
      required: false,
    },
    mb_point: {
      type: String,
      required: false,
      default: 0,
    },
    mb_top: {
      type: String,
      required: false,
      default: "N",
      enums: {
        values: ordernary_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
    mb_views: {
      type: Number,
      required: false,
      default: 0, //kiritilmaganda default 0 bolsin degani
    },
    mb_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    mb_follow_cnt: {
      type: Number,
      required: false,
      default: 0,
    },
    mb_subscriber_cnt: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  { timestamps: true } // buni qoysak db avtomatik ravishda createdAT/updated qiymatlarini ni qoyib beradi
);

module.exports = mongoose.model("Member", memberSchema); //model 2 narsa oladi member deb birlikda yozilsada database members deb koplikda data base hosil qiladi
