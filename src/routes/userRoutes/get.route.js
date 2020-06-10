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

router.post("/categories", async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  let category = await Category.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(category);
});
router.post("/categorieswithProducts", async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  let category = await Category.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  async function someFunction() {
    const j = category.length;
    const cat = [];
    for (let i = 0; i < j; i++) {
      // wait for the promise to resolve before advancing the for loop
      const Products = await Product.find({
        _id: { $in: category[i].Products },
      }).limit(4);

      cat.push({
        ...category[i]._doc,
        Products,
        image: `/api/serveImage/category/${category[i]._id}`,
      });
    }

    return cat;
  }

  category = await someFunction();

  res.status(200).json(category);
});

router.post("/campaign", async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const campaign = await Campaign.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(campaign);
});

router.post("/sale", async (req, res) => {
  const { filters, only, sort, limit, skip } = getOptions(req.body);

  const sale = await Sale.find(only, filters)
    .sort(sort)
    .limit(limit)
    .skip(skip);

  res.status(200).json(sale);
});

router.post("/coupon", async (req, res) => {
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
