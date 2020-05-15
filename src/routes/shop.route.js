const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

const AuthMiddleware = require("../middleware/authMiddleWare");
const Category = mongoose.model("category");
const Product = mongoose.model("product");

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

router.get("/test", (req, res) => {
  res.json({ message: "Category route works" });
});

router.post(
  "/addCategory",
  AuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const requiredFields = ["name"];
    const recived = req.body;
    let isValid = requiredFields.every((field) =>
      Object.keys(recived).includes(field)
    );

    if (!isValid)
      return res.status(400).json({ error: "required fields not found" });

    const image = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();

    new Category({
      name: recived.name,
      image,
    })
      .save()
      .then((category) => res.status(201).json(category))
      .catch((err) => res.status(500).json(err));
  }
);

router.post(
  "/addProduct",
  AuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const requiredFields = ["name", "quantity", "price", "categoryId"];
    const recived = req.body;
    let isValid = requiredFields.every((field) =>
      Object.keys(recived).includes(field)
    );

    const image = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();

    if (!isValid)
      return res.status(400).json({ error: "required fields not found" });

    const category = await Category.findById(recived.categoryId, { image: 0 });

    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    const newProduct = new Product({
      ...recived,
      image,
    });

    category.Products.push(newProduct._id);
    category
      .save()
      .then(() => {
        newProduct.save().then((data) => {
          res.json({ data });
        });
      })
      .catch((err) => res.status(500).json({ error: "Server error" }));
  }
);

module.exports = router;
