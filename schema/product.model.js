const mongoose = require("mongoose");
const {
    product_collection_enums,
    product_status_enums,
} = require("./lib/config")
const Schima = mongoose.Schema;//documentationgaquydagicha kora mongooseni ichidan Schima modulni olish mumkin

const productSchima = new mongoose.Schema({
    product_name: {
        type: String, 
        required: true
    },
    product_collection:{
        type: String,
        required: true,
        enum:{
            values:product_collection_enums,
            message: "{VALUE}   is not among permitted enum values!",
        },
    },
    product_status: {
        type: String,
        required: false,
        default: "PAUSED",
        enum:{
            values:product_status_enums,
            message: "{VALUE}   is not among permitted enum values!",
        }, 
    },
    product_price: {
        type: Number,
        required: true
    },
    product_discount: {
        type: Number,
        required: false,
        default: 0 
    },
    product_left_cnt: {
        type: Number,
        required: true
    },
    product_size: {
        type: String,
        default: "normal",
        required: function() {
            const sized_list = ["drink", "salad", " dessert"];
            return sized_list.includes(this.product_collection)
        },    //todo
        enum:{
            values:product_size_enums,
            message: "{VALUE}   is not among permitted enum values!",
        }, 
    },
    product_volume: {
        type: String,
        default: 1 ,
        required: function() {
            return (this.product_collection === "drink")
        },
        enum:{
            values:product_volume_enums,
            message: "{VALUE}   is not among permitted enum values!",
        }, 
    },
    product_description: {
        type: String,
        required: true
    },
    product_images: {
        type: Array,
        required: false,
        default: []
    },
    product_likes: {
        type: Number,
        required: false,
        default: 0
    },
    product_views: {
        type: Number,
        required: false,
        default: 0
    },
    restaurant_mb_id: {
        type: Schima.Types.ObjectId, //mongoDB objectId bilan saxranit qilish uchun instens oldik keyin gina population qilsa agregation qilsa boladi  bu MongoDB ni yuragidir
        ref: "Member", // ref(refrence) qaysi databasega boglangan deyilganda "Member"ga boglangani korsatilyapti
        required: false
    }

}, {timestamps: true}); //createdAT & updatedAT

productSchima.index(
    {restaurant_mb_id: 1, product_name: 1, product_size: 1, product_volume: 1},// Texas-De-Brazilcoca-colanull2 <= quydagi tartibda MongoDb qoshib oqidi
    {unique: true}                                                             //Agar torta qiymat takrorlansa eror qaytaradi
    );

    module.exports = mongoose.model("Product", productSchema);