const mongoose = require("mongoose");
const {
  product_collection_enums,
  product_status_enums,
  product_size_enums,
  product_volume_enums,
} = require("../lib/config"); // slesh oldidan ./ faqat bitta nuqta qoyib 8 soat ERROR izladim. OSCAR barbir aytmadi.  @@#$%#^%$%^$&^%&
const Schema = mongoose.Schema; //documentationgaquydagicha kora mongooseni ichidan Schima modulni olish mumkin

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        message: "{VALUE}   is not among permitted enum values!",
      },
    },
    product_status: {
      type: String,
      required: false,
      default: "PAUSED",
      enum: {
        values: product_status_enums,
        message: "{VALUE}   is not among permitted enum values!",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      required: false,
      default: 0,
    },
    product_left_cnt: {
      type: Number,
      required: true,
    },
    product_size: {
      type: String,
      default: "normal",
      required: function () {
        //bu yerda function tuzvolamiz yani ichimlik emas ovqat bolganda product_size ni  chaqir yani normal,set,large kabi
        const sized_list = ["drink", "salad", " dessert"];
        return sized_list.includes(this.product_collection);
      }, //todo
      enum: {
        values: product_size_enums,
        message: "{VALUE}   is not among permitted enum values!",
      },
    },
    product_volume: {
      type: String,
      default: 1,
      required: function () {
        //bu yerda function tuzvolamiz yani ovqat emas ichimlik bolganda volumeni chaqir yani 1 Liter,2 liter kabi
        return this.product_collection === "drink";
      },
      enum: {
        values: product_volume_enums,
        message: "{VALUE}   is not among permitted enum values!",
      },
    },
    product_description: {
      type: String,
      required: true,
    },
    product_images: {
      type: Array,
      required: false,
      default: [],
    },
    product_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    product_views: {
      type: Number,
      required: false,
      default: 0,
    },
    restaurant_mb_id: {
      type: Schema.Types.ObjectId, //mongoDB objectId bilan saxranit qilish uchun instens oldik keyin gina population qilsa agregation qilsa boladi  bu MongoDB ni yuragidir
      ref: "Member", // ref(refrence) qaysi databasega boglangan deyilganda "Member"ga boglangani korsatilyapti
      required: false,
    },
  },
  { timestamps: true }
); //createdAT & updatedAT

productSchema.index(
  { restaurant_mb_id: 1, product_name: 1, product_size: 1, product_volume: 1 }, // Texas-De-Brazilcoca-colanull2 <= quydagi tartibda MongoDb qoshib oqidi
  { unique: true } //Agar torta qiymat takrorlansa eror qaytaradi
); ////unique:true yuqoridagi 4 ta narsani tekshirip takrorlanmasligini oldini oladi

module.exports = mongoose.model("Product", productSchema); // Bu yerda ham Schema deyish orniga Schima deb qoyipman 2 1 soat xato qidirdim
