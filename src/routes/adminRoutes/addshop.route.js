const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

const AuthMiddleware = require("../../middleware/authMiddleWare");
const Category = mongoose.model("category");
const Product = mongoose.model("product");
const Campaign = mongoose.model("campaign");
const Sale = mongoose.model("sale");
const Coupon = mongoose.model("coupon");

const doesContain = require("../../utils/doesContain.util");

const upload = multer({
  limits: {
    fileSize: 1048576
     * 2,
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
    const recived = req.body;
    const isValid = doesContain(["name"], recived);

    if (!isValid)
      return res.status(400).json({ error: "required fields not found" });

    const image = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();

    new Category({
      ...recived,
      image,
    })
      .save()
      .then((cate) => res.status(201).json({success : true,_id : cate._id}))
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
    const isValid = doesContain(requiredFields, recived);
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
          res.status(201).json({success : true,_id : data._id})
        });
      })
      .catch((err) => res.status(500).json({ error: "Server error" }));
  }
);

router.post(
  "/addCampaign",
  AuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const requiredFields = ["name"];
    const recived = req.body;
    const isValid = doesContain(requiredFields, recived);

    if (!isValid)
      return res.status(400).json({ error: "required fields not found" });

    const image = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();

      const newCampaign =  new Campaign({
        ...recived,
        image,
      })

    // if(recived.items){
    //   console.log(recived.items);
    //   recived.items.map(item=>{
    //     Product.findByIdAndUpdate(item,{$push:{campaigns : newCampaign._id}})
    //   })
    // }

   
      newCampaign.save()
      .then((data) => {
        res.status(201).json({success : true,_id : data._id})
      })
      .catch((err) => res.status(500).json(err));
  }
);

router.post(
  "/addSale",
  AuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const requiredFields = ["name"];
    const recived = req.body;
    const isValid = doesContain(requiredFields, recived);

    if (!isValid)
      return res.status(400).json({ error: "required fields not found" });

    const image = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();

   const newSale =  new Sale({
      ...recived,
      image,
    })
    // if(recived.items){
    //   console.log(recived.items);
    //   recived.items.map(item=>{
    //     Product.findByIdAndUpdate(item,{$push:{sales : newSale._id}})
    //   })
    // }


      newSale.save()
      .then((data) => {
        res.status(201).json({success : true, _id : data._id})
      })
      .catch((err) => res.status(500).json(err));
  }
);

router.post(
  "/addCoupon",
  AuthMiddleware,
  async (req, res) => {
    const requiredFields = ["name","code"];
    const recived = req.body;
    const isValid = doesContain(requiredFields, recived);

    if (!isValid)
      return res.status(400).json({ error: "required fields not found" });


   const newCoupon =  new Coupon({
      ...recived,
    })



  newCoupon.expiry = new Date(recived.expiry)
      
      newCoupon.save()
      .then((data) => {
        res.status(201).json({success : true , _id : data._id})
      })
      .catch((err) => res.status(500).json(err));
  }
);

router.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

module.exports = router;
