const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "RESTAURANT"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordenary_enums = ["Y", "N"];
exports.product_collection_enums =["dish","salat", "dessert", "drink", "etc"];
exports.product_status_enums =["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums =["small", "normal", "large", "set"];
exports.product_volume_enums = [0.5, 1, 1.2, 1.5, 2];

/*******************************************
 *            MONGO DB RELATED COMMANDS
 *******************************************/

exports.shapeIntoMongooseObjectId = (target) => {
    if( typeof target === "string") {//mongooose ichidagi Typs variable dagi ObjectId bor
        return new mongoose.Types.ObjectId(target);
    }else
        return target;    
};

