const Product = require("../models/Product");
const assert = require("assert");
const Definer = require("../lib/mistake");

let productController = module.exports;

productController.getAllProducts = async (req, res) => {
    try{
        console.log("GET: cont/getAllProducts");

      }catch(err){
        console.log(`ERROR: cont/getAllProducts, ${err.message}`);
        res.json({state: "fail", message: err.message});
      }
};
productController.addNewProduct = async (req, res) => {
    try{
        console.log("POST: cont/addNewProduct");
        assert(req.files, Definer.general_err3);

        const product = new Product();
        let data = req.body; //kelyotkan req body qismidagi malumotlani dataga yozamiz

        data.product_images = req.files.map(ele => { // req.filesdan olgan malumotlarni map qilgan holda pathini DB ga array korinishida saqlanadi  
          return ele.path;
        });

        const result = await product.addNewProductData(data, req.member);

        console.log("data: ", data); //data:  [Object: null prototype] => product_images : olma.jpeg

        const html = `<script>alert(new dish added succeessfuly);
                      window.location.replace('/resto/products/menu');
        </script>`
      res.end(html);
      }catch(err){
        console.log(`ERROR: cont/addNewProduct, ${err.message}`);
      }
};

productController.updataChosenProduct = async (req, res) => {
    try{
        console.log("GET: cont/updataChosenProduct");
        
      }catch(err){
        console.log(`ERROR: cont/updataChosenProduct, ${err.message}`);
        res.json({state: "fail", message: err.message});
      }
};

// let productController = module.exports;

// productController.getAllProducts = async (req, res) => {
//     try{
//         console.log("GET: cont/getAllProducts");

//       }catch(err){
//         console.log(`ERROR: cont/getAllProducts, ${err.message}`);
//         res.json({state: "fail", message: err.message});
//       }
// };

// productController.addNewProduct = async (req, res) => {
//     try{
//         console.log("POST: cont/addNewProduct");
//         // console.log(req.member);
//       //TODO: product creation develop
//       res.send("ok");
//       }catch(err){
//         console.log(`ERROR: cont/addNewProduct, ${err.message}`);
//       }
// };

// productController.updataChosenProduct = async (req, res) => {
//     try{
//         console.log("GET: cont/updataChosenProduct");
        
//       }catch(err){
//         console.log(`ERROR: cont/updataChosenProduct, ${err.message}`);
//         res.json({state: "fail", message: err.message});
//       }
// };