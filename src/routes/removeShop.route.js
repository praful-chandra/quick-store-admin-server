const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const AuthmiddleWare = require("../middleware/authMiddleWare");

const Product = mongoose.model("product");

router.delete("/deleteProduct", AuthmiddleWare, async (req, res) => {
  const PId = req.body._id;

  
  try{
    if (!PId) throw Error("required field not present");

        await Product.findByIdAndRemove(pId).then(()=>res.json({success :true}))
  }
  catch (err){
      res.status(500).json("error");
  }
});

module.exports = router;
