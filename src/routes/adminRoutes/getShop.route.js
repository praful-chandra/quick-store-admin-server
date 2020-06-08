const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const AuthMiddleware = require("../../middleware/authMiddleWare");

const getOptions = require("../../utils/getOprions");

const Product = mongoose.model("product");
const Category = mongoose.model("category");
const Campaign = mongoose.model("campaign");
const Sale = mongoose.model("sale");
const Coupon = mongoose.model("coupon");

router.post("/allproducts", AuthMiddleware, async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const products = await Product.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  const totalCount = await Product.find(only, filters)
    .sort(sort)
    .countDocuments();

  res.status(200).json({ products, totalCount });
});

router.post("/allcategories", AuthMiddleware, async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const category = await Category.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(category);
});

router.post("/allcampaign", AuthMiddleware, async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const campaign = await Campaign.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(campaign);
});

router.post("/allsale", AuthMiddleware, async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const sale = await Sale.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(sale);
});


router.post("/allcoupon", AuthMiddleware, async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const coupon = await Coupon.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(coupon);
});


module.exports = router;
