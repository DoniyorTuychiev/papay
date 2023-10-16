//servise Model 
//agar model collection bilan togridan tori ishlasa u SERVICE Model deyiladi
//agar model collection bilan emas model bilan toridan tori ishlasa u SCHIMA Model deyiladi
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const assert = require("assert");

class Member {
    constructor() {
        this.memberModel = MemberModel;
    }
    
    /**signup section start */
    async signupData(input) {
        const new_member = new this.memberModel(input);
        try{
            
            let result;//result ga try ni ichidayam tashqarisidayam ulana olish uchun let result ni tashqarida  yaratdik
            try{//bu orinda MongoDB dan kelishi mumkin bolgan EROR lar uchun alohida try/catch ochib unga err ni 
                //mistake.js da Definer class ochdik va err ga qiymat berdik
            result = await new_member.save();
            }catch(mongo_err){
                console.log(mongo_err);
                throw new Error(Definer.auth_err1);
            }
            console.log(result);

            result.mb_password = "";//create qilganda har safar passwordni qaytarmaslgi uchun uni stringga tenglap qoydik
                                    //endi password kerak deb db dan chaqirilsagina db passwordni uzatadi
            return result; 
        }catch(err){
            throw err;
        }
    }
/**signup section finesh */
/**login section start */

    async loginData(input) {
        // const new_member = new this.memberModel(input);//videoda yerga yozilmagan lekiin yozdim aks holda ishlamadi
        try{
            const member = await this.memberModel
            .findOne(
                {mb_nick: input.mb_nick},
                {mb_nick:1 , mb_password: 1}//password select:false bogani uchun 1 marta passwordni db dan soradik
                )
            .exec();

            assert.ok(member, Definer.auth_err3);                
            
            const isMatch = input.mb_password === member.mb_password;//solishtirish uchun 
            assert.ok(member, Definer.auth_err4);                
            
            return await this.memberModel
            .findOne({mb_nick: input.mb_nick,
            })
            .exec();

        }catch(err) {
            throw err;
        }
    }

/**login section start */
/**logout section start */



/**logout section start */



}

module.exports = Member;