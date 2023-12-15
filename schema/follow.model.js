const mongoose = require ("mongoose");
const {} = require("../lib/config");
const Schema = mongoose.Schema;

const followSchema = new mongoose.Schema(
  {
    follow_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    subscriber_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },

  { timestamps: true } // buni qoysak db avtomatik ravishda createdAT/updated qiymatlarini ni qoyib beradi
);
followSchema.index({ follow_id: 1, subscriber_id: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema); //model 2 narsa oladi member deb birlikda yozilsada database members deb koplikda data base hosil qiladi
