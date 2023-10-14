//Schima model
//Schima Model Model ga togridan tori boglanadi Model esa Controllerga toridan tori boglanadi

const mongoose = require("mongoose");
const {member_type_enums, member_status_enums} = require("../lib/config");

const memberSchema = new mongoose.Schema({
    mb_nick : {
        type: String,
        required: true,
        index: {unique: true, sparse: true}
    },
    mb_phone: {
        type: String,
        required: true
    },
    mb_password: { 
        type: String,
        required: true,
        select: false //pasword qaytarilmasligi uchun qoyildi
    },
    mb_type: {
        type: String,
        required: true,
        default: "USER",// hamma kirgan user default holatda USER bolishi uchun qoyildi
        enum: {
            values: member_type_enums,
            message: "{VALUE} is not among permitted values"
        }
    },
    mb_status: {
        type: String,
        required: false,
        default: "ACTIVE",
        enum: {
            values: member_status_enums,
            message: "{VALUE} is not among permitted values"
        }
    },
    mb_full_name: {
        type: String,
        required: false
    },
    mb_address: {
        type: String,
        required: false
    },
    mb_images: {
        type: String,
        required: false
    },
    mb_point: {
        type: String,
        required: false,
        default: 0
    }    

});

module.exports = mongoose.model("Member", memberSchema); //model 2 narsa oladi member deb birlikda yozilsada database members deb koplikda data base hosil qiladi