const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const AuthmiddleWare = require("../middleware/authMiddleWare");

const Product = mongoose.model("product");
const Category = mongoose.model("category");

router.delete("/deleteProduct", AuthmiddleWare, async (req, res) => {
  const PId = req.body._id;

  try {
    if (!PId) throw Error("required field not present");

   const product =  await Product.findById(PId);
  product.remove().then(() =>
  res.json({ success: true })
);
  } catch (err) {
    
    res.status(500).json("error");
  }
});

router.delete("/deleteCategory", AuthmiddleWare, async (req, res) => {
  const cId = req.body._id;

  try {
    if (!cId) throw Error("Required field not found");

    const category = await Category.findById(cId);
    category.remove().then(() =>
    res.json({ succedd: true })
  );;
    

  } catch (err) {
    res.status(500).json("error");
  }
});

module.exports = router;
