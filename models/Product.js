const assert = require("assert");
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Product {
    constructor() {
    this.productModel = ProductModel;        
    }

    async addNewProductData(data, member) {
        try{
            data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id);
            console.log("data:", data);
            
            const new_product = new this.productModel(data);
            const result = await new_product.save();

            
            assert.ok(result, Definer.general_err1);
            return result;
        }catch(err){
            throw err;
        }
    }
}

module.exports = Product;