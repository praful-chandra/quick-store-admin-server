const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const AuthMiddleware = require("../../middleware/authMiddleWare");

const Category = mongoose.model("category");
const Product = mongoose.model("product");
const Campaign = mongoose.model("campaign");
const Sale = mongoose.model("sale");
const Coupon = mongoose.model("coupon");
const Order = mongoose.model("order");

const chekAllProdExist = require("../../utils/checkAllProductsExist");

const upload = multer({
  limits: {
    fileSize: 1000000 * 2,
  },
  fileFilter(req, file, next) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return next(new Error("only .jpg,jpeg,png files are accepted"));
    }

    next(undefined, true);
  },
});

router.get("/testUpdate", (req, res) => {
  res.json({ message: "update shop route works" });
});

router.patch(
  "/updateProduct",
  AuthMiddleware,
  upload.single("image"),
  async (req, res, next) => {
    const recived = req.body;

    const product = await Product.findById(recived._id);

    if (req.file) {
      const image = await sharp(req.file.buffer)
        .resize({ width: 500, height: 500 })
        .png()
        .toBuffer();

      recived.image = image;
    }
    if (recived.discount && (recived.discount > 100 || recived.discount < 0))
      return res.status(400).json({ error: "discount invalid" });

    if (recived.categoryId !== product.categoryId) {
      try {
        const oldCategory = await Category.findById(product.categoryId);
        oldCategory.Products = oldCategory.Products.filter(
          (id) => id != recived._id
        );

        (await oldCategory).save();

        const newCategory = await Category.findById(recived.categoryId);
        newCategory.Products.push(product._id);

        (await newCategory).save();
      } catch (err) {
        console.log(err);

        return next(new Error(err));
      }
    }

    product
      .updateOne({ ...recived })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

router.patch(
  "/updatecategory",
  AuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const recived = req.body;

    const category = await Category.findById(recived._id);

    if (req.file) {
      const image = await sharp(req.file.buffer)
        .resize({ width: 500, height: 500 })
        .png()
        .toBuffer();

      recived.image = image;
    }

    category
      .updateOne({ ...recived })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

router.patch("/updateCoupon", AuthMiddleware, async (req, res) => {
  const recived = req.body;

  const coupon = await Coupon.findById(recived._id);

  if (recived.items) {
    recived.items = await chekAllProdExist(recived.items);
  }
  if (recived.discount && (recived.discount > 100 || recived.discount < 0))
    return res.status(400).json({ error: "discount invalid" });

  coupon
    .updateOne({ ...recived })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.patch(
  "/updatecampaign",
  AuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const recived = req.body;

    const campaign = await Campaign.findById(recived._id);

    if (req.file) {
      const image = await sharp(req.file.buffer)
        .resize({ width: 500, height: 500 })
        .png()
        .toBuffer();

      recived.image = image;
    }

    if (recived.items) recived.items = await chekAllProdExist(recived.items);
    campaign
      .updateOne({ ...recived })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

router.patch(
  "/updatesale",
  AuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const recived = req.body;

    const sale = await Sale.findById(recived._id);

    if (req.file) {
      const image = await sharp(req.file.buffer)
        .resize({ width: 500, height: 500 })
        .png()
        .toBuffer();

      recived.image = image;
    }
    
    if (recived.items) recived.items = await chekAllProdExist(recived.items);

    if (recived.discount && (recived.discount > 100 || recived.discount < 0))
      return res.status(400).json({ error: "discount invalid" });

    sale
      .updateOne({ ...recived })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

router.patch("/updateorders", AuthMiddleware, (req, res) => {
  if (!req.body.status || !req.body._id) {
    return res.send();
  }

  Order.findByIdAndUpdate(req.body._id, {
    $set: { orderStatus: req.body.status },
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(500).json("err"));
});

router.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

module.exports = router;
