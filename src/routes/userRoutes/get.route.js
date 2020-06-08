const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const getOptions = require("../../utils/getOprions");

const Product = mongoose.model("product");
const Category = mongoose.model("category");
const Campaign = mongoose.model("campaign");
const Sale = mongoose.model("sale");
const Coupon = mongoose.model("coupon");

router.get("/test", (req, res) => {
  res.json({ message: "get route works" });
});

router.post("/products", async (req, res) => {
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

router.get("/categories", async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const category = await Category.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(category);
});

router.get("/campaign", async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const campaign = await Campaign.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(campaign);
});

router.get("/sale", async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const sale = await Sale.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(sale);
});

router.get("/coupon", async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const coupon = await Coupon.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(coupon);
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = router;
