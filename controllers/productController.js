const Product = require("../models/Product");
const assert = require("assert");
const Definer = require("../lib/mistake");

let productController = module.exports;

/**********************************************************************
 *                  REACT RELATED MTHODS                               *
 **********************************************************************/

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");
    const product = new Product();
    const result = await product.getAllProductsData(req.member, req.body);

    return res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllProducts, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/getChosenProduct");
    const product = new Product();
    const id = req.params.id;

    const result = await product.getChosenProductData(req.member, id);

    return res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenProduct, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

/**********************************************************************
 *                  BSSR RELATED MTHODS                               *
 **********************************************************************/
productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    assert.ok(req.files, Definer.general_err3);
    console.log(req.files);
    const product = new Product(); //product ServiceModel dan instance olyapmiz
    let data = req.body; //kelyotkan req body qismidagi malumotlani dataga yozamiz

    data.product_images = req.files.map((ele) => {
      // req.filesdan olgan malumotlarni map qilgan holda pathini DB ga array korinishida saqlanadi
      console.log(req.files);
      return ele.path.replace(/\\/g, "/");
    });

    const result = await product.addNewProductData(data, req.member);
    console.log("data: ", data); //data:  [Object: null prototype] => product_images : olma.jpeg

    const html = `<script>alert('new dish added succeessfuly');
                      window.location.replace('/resto/products/menu');
        </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR: cont/addNewProduct, ${err.message}`);
  }
};

productController.updataChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updataChosenProduct");
    const product = new Product();
    console.log(req.params);
    const id = req.params.id,
      result = await product.updataChosenProductData(
        id,
        req.body,
        req.member._id
      );
    return res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR: cont/updataChosenProduct, ${err.message}`);
    res.json({ state: "fail", message: err.message });
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
