const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const AuthMiddleware = require("../middleware/authMiddleWare");

const Product = mongoose.model("product");
const Category = mongoose.model("category");

router.post("/allproducts", AuthMiddleware, async (req, res) => {
  const filters = req.body.filters ? req.body.filters : {};
  const only = req.body.only ? req.body.only : {};
  const sort = req.body.sort ? req.body.sort : {};
  const limit = req.body.limit ? req.body.limit : 0;
  const skip = req.body.skip ? req.body.skip : 0;

  console.log(only);
  
  
  const products = await Product.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);


  res.status(200).json(products);
});

router.post("/allcategories", AuthMiddleware, async (req, res) => {
  const only = req.body.only ? req.body.only : {};
  const filters = req.body.filters ? req.body.filters : {};
  const sort = req.body.sort ? req.body.sort : {};
  const limit = req.body.limit ? req.body.limit : 0;
  const skip = req.body.skip ? req.body.skip : 0;
  const category = await Category.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(category);
});

module.exports = router;
