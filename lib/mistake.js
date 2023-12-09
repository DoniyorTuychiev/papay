class Definer {
    /**general errors */
    static general_err1 = "att: somthing went wrong!";
    static general_err2 = "att: there is no data with that params!";
    static general_err3 = "att: file upload error!";


    /**member auth related */
    static auth_err1 = "att: mongodb validation is failed!";
    static auth_err2 = "att: you are inserting already used member nick or phone !";
    static auth_err3 = "att: no member without mb nick !";
    static auth_err4 = "att: There is not token!";
    static auth_err5 = "att: You are no authenticated!";

    /**products related errors */

    static product_err1 = "att: product creation failed !";
    
    /**orders related errors */

    static order_err1 = "att: order creation failed !";
}

module.exports = Definer;