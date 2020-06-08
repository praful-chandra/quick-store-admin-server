const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const AuthmiddleWare = require("../../middleware/authMiddleWare");

const Product = mongoose.model("product");
const Category = mongoose.model("category");
const Campaign = mongoose.model("campaign");
const Sale = mongoose.model("sale");
const Coupon = mongoose.model("coupon");

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

router.delete("/deleteCampaign",AuthmiddleWare,async (req,res)=>{
  const CampId = req.body._id;

  try{

    if(!CampId) throw Error();

    const campaign = await Campaign.findById(CampId);
    campaign.remove().then(()=>{
      res.json({success : true});
    })

  }
  catch (err){   
    res.status(500).json("Error");
  }

})

router.delete("/deleteSale",AuthmiddleWare,async (req,res)=>{
  const saleId = req.body._id;

  try{

    if(!saleId) throw Error();

    const sale = await Sale.findById(saleId);
    sale.remove().then(()=>{
      res.json({success : true});
    })

  }
  catch (err){   
    res.status(500).json("Error");
  }

})

router.delete("/deletecoupon",AuthmiddleWare,async (req,res)=>{
  const coupId = req.body._id;

  try{

    if(!coupId) throw Error();

    const coupon = await Coupon.findById(coupId);
    coupon.remove().then(()=>{
      res.json({success : true});
    })

  }
  catch (err){   
    res.status(500).json("Error");
  }

})

module.exports = router;
