//servise Model 
//agar model collection bilan togridan tori ishlasa u SERVICE Model deyiladi
//agar model collection bilan emas model bilan toridan tori ishlasa u SCHIMA Model deyiladi
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");

class Member {
    constructor() {
        this.memberModel = MemberModel;
    }

    async signupData(input) {
        try{
            const new_member = new this.memberModel(input);
            
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
}

module.exports = Member;