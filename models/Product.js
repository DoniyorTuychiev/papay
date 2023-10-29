const assert = require("assert");
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");
const { shapeIntoMongooseObjectId } = require("../lib/config");

class Product {
    constructor() {
    this.productModel = ProductModel;        
    }

    async getAllProductsDataResto(member){
        try{
            member._id = shapeIntoMongooseObjectId(member._id);
            const result = await this.productModel
            .find({
                restaurant_mb_id:member._id,
            });
            assert.ok(result, Definer.general_err1);
            return result;
        }catch(err){
            throw err;
        }
    }

    async addNewProductData(data, member) {
        try{
            
            data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id);
            
            const new_product = new this.productModel(data);// productSchema modeldan new_product instance olib unga datani argument sifatida jonatyapmiz
            const result = await new_product.save();
            
            assert.ok(result, Definer.general_err1);
            return result;
        }catch(err){
            throw err;
        }
    }
    async updataChosenProductData(id, updated_data, mb_id){
        try{
            id = shapeIntoMongooseObjectId(id);
            mb_id = shapeIntoMongooseObjectId(mb_id);
            //yangilangan datani berish qismi boshlandi
            const result = await this.productModel
            .findOneAndUpdate({_id: id, restaurant_mb_id: mb_id}, updated_data,{
                runValidators: true,
                lean: true,
                returnDocument: "after",
            })
            //yangilangan datani berish qismi tugadi. Agar after orniga before qoyilsa oldingi datani uzatib beradi

            .exec();

            assert.ok(result, Definer.general_err1);
            return result;
        }catch(err){
            throw err;
        }
    }
}

module.exports = Product;