class Definer {
  /**general errors */
  static general_err1 = "att: somthing went wrong!";
  static general_err2 = "att: there is no data with that params!";
  static general_err3 = "att: file upload error!";

  /**member auth related */
  static auth_err1 = "att: mongodb validation is failed!";
  static auth_err2 =
    "att: you are inserting already used member nick or phone !";
  static auth_err3 = "att: no member without mb_nick !";
  static auth_err4 = "att: There is not token!";
  static auth_err5 = "att: You are no authenticated!";

  /**products related errors */

  static product_err1 = "att: product creation failed !";

  /**orders related errors */

  static order_err1 = "att: order creation failed !";
  static order_err2 = "att: orderItem creation failed !";
  static order_err3 = "att: no Orders with that params exists!";

  //articles releted errors
  static article_err1 = "att: author member for articles not provided !";
  static article_err2 = "att: no article found for that member !";
  static article_err3 = "att: no article found for that target !";

  //follow releted errors
  static follow_err1 = "att: self subscribtion is denied !";
  static follow_err2 = "att: new follow subscribtion is failled !";
  static follow_err3 = "att: no follow data found !";

}

module.exports = Definer;
