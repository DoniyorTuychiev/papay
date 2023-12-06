//servise Model 
//Agar model collection bilan togridan tori ishlasa u SERVICE Model deyiladi

const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require("bcryptjs");                                
const { shapeIntoMongooseObjectId } = require("../lib/config");
const View = require("./View");
        
class Member {
    constructor() {
        this.memberModel = MemberModel;
    }
    /////////////////////////////////////////
    /**signup section start */
    async signupData(input) {
        // const new_member = new this.memberModel(input); buni tushunmadim nimaga ochirildi
        try{
            const salt = await bcrypt.genSalt();
            input.mb_password = await bcrypt.hash(input.mb_password, salt);
            const new_member = new this.memberModel(input);              
            let result;                                        
                                    
            try{         
                result = await new_member.save();
                }catch(mongo_err){
                    console.log(mongo_err);
                    throw new Error(Definer.auth_err1);
                }
                 console.log(result);

                result.mb_password = "";                               
        
            return result; 
        }catch(err){
            throw err;
        }
    }
/**signup section finesh */
////////////////////////////////////////////////////////////
/**login section start */
    async loginData(input) {
        const new_member = new this.memberModel(input);//videoda yerga yozilmagan lekiin yozdim aks holda ishlamadi
        try{
            const member = await this.memberModel
            .findOne(
                {mb_nick: input.mb_nick},
                {mb_nick: 1, mb_password: 1}       //????                   
                )
            .exec();

            assert.ok(member, Definer.auth_err3);                
            
            const isMatch = await bcrypt.compare(     //db dagi password va inputdan kiritilgan password mosligini solishtirish uchun
                
                input.mb_password,
                member.mb_password
                );    
            
            assert.ok(member, Definer.auth_err4);                
            
            return await this.memberModel
            .findOne({mb_nick: input.mb_nick,
            })
            .exec();
        }catch(err) {
            throw err;
        }
    }

/**login section finesh */
///////////////////////////////////////////////////////////
/**logout section start */



/**logout section finesh */
    async getChosenMemberData(member, id) {         
        try{
            id = shapeIntoMongooseObjectId(id);
            console.log("memeber::", member);

            if(member){
                //condition if not seen before
                await this.viewChosenItemByMember(member, id, 'member');
            }

            const result = await this.memberModel
            .aggregate([{ $match: { _id: id, mb_status: "ACTIVE" }},
                {$unset: "mb_password"},
                   //TO DO: check auth member liked the chosen member                                      
            ])                                                                //agregate()methodi asosas deepSeachingda ishlatiladi
              .exec();                                                       //bizga bu yerda kiritilyatgan id ni db dagi _id yoki boshqa kerakli narsani EX mb_status bilan solishtiradi               

            assert.ok(result, Definer.general_err2);
            return result[0];
            
        }catch(err) {
            throw err;
        }
    }
    //1) member, 2)view_ref_id, 3)group_type)=>qanaqa target bolyapti=>3)product;qaysi product ref boryapti yani id si=> 2) qovurdoq => id; Kim koryapti => 1) uni id si
    async viewChosenItemByMember (member, view_ref_id, group_type) {
        try{
            view_ref_id = shapeIntoMongooseObjectId(view_ref_id); //<= Kim koryapti
            const mb_id = shapeIntoMongooseObjectId(member._id);  //<= Biz koryapmiz yani ligin bolgan user
        
            const view = new View(mb_id);

            //validation needed
            const isValid = await view.validateChosenTarget(view_ref_id, group_type);
            assert.ok(isValid, Definer.general_err2);   //

            //logged user has seen target before
            const doesExist = await view.checkViewExistence(view_ref_id);
            console.log("doesExist:", doesExist);

            if(!doesExist){
                const result = await view.insertMemberView(view_ref_id, group_type);
                assert.ok(result, Definer.general_err1);
            }
            return true;
        }catch(err){
            throw err;
        }
    }

}


module.exports = Member;