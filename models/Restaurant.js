
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Member = require("./Member");

class Restaurant {
    constructor(){
        this.memberModel = MemberModel;
    }

    async getRestaurantsData(member, data) {
        try{
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
            let match = {mb_type: "RESTAURANT", mb_status: "ACTIVE"};
            let aggregationQuery = [];
            data.limit = data["limit"] * 1; //bu yerda limit 4 ga page 1 ga teng yani 1-page da kopi bilan 4 ta restaurantni chiqar degani
            data.page = data["page"] * 1;   // 1* sababi url dan kelyotkani uchun string boladi *1 esa numberga aylantirib beradi. numberga aylantirishni 4 xil usuli bor

            switch (data.order) {
                case "top":
                    match["mb_top"] = "Y";
                    aggregationQuery.push({ $match: match });
                    aggregationQuery.push({ $sample: { size: data.limit } });
                    break;
                case "random":
                    aggregationQuery.push({$match: match});
                    aggregationQuery.push({$sample: { size: data.limit } });
                    break;
                default:
                    aggregationQuery.push({$match: match});
                    const sort = {[ data.order]: -1 };
                    aggregationQuery.push({$sort: sort});
                    break;    
            }

            aggregationQuery.push({$skip: [data.page -1] * data.limit});
            aggregationQuery.push({$limit: data.limit });
            //TO DO: check auth member liked the chosen target

            const result = await this.memberModel
            .aggregate(aggregationQuery)
            .exec();

            assert.ok(result, Definer.general_err1);
            console.log("result:::", result);
            return result;
        }catch(err){
            throw err;
        }
    };

    async getAllRestaurantsData() {
        try{
            const result = await this.memberModel
            .find({
                mb_type: "RESTAURANT",
            })
            .exec();

            assert.ok(result, Definer.general_err1);
            return result;
        }catch(err){
            throw err;
        }
    }

    async getChosenRestaurantData( member, id) {
        try{
            id = shapeIntoMongooseObjectId(id);

            if(member){
                const member_ob = new Member(); //RestaurantServiceModeli ichida MemberServiceModeli dan foydalanganimiz uchun member_object yasab olyapmiz
                await member_ob.viewChosenItemByMember(member, id, "member");//agar  asyc method oldidan await qoyilmasa malumotlar ozgarishi kutilmasdan keyingi etapga otip ketiladi shuning uchun await qoyilishi shart
            }

            const result = await this.memberModel
                .findOne({
                    _id: id,
                    mb_status: "ACTIVE", 
                })
                .exec();

            assert.ok(result, Definer.general_err2);
            return result;
        }catch(err){
            throw(err);
        }     
    }

    async updateRestaurantByAdmin(update_data) {
        try{
            const id = shapeIntoMongooseObjectId(update_data ?.id);
            const result = await this.memberModel
            .findByIdAndUpdate({ _id: id}, update_data, {
                runValidators: true,
                lean: true,
                returnDocument: "after",
            })
            .exec();

            assert.ok(result, Definer.general_err1);
            return result;
        }catch(err){
            throw err;
        }
    }
}

module.exports = Restaurant;