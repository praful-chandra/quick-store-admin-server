const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = mongoose.model("product");
const Category = mongoose.model("category");

router.get("/product/:id",async (req,res)=>{

    try{
        const imageBuffer = await Product.findById(req.params.id,{image : 1})
 
        res.set('Content-Type','image/png');
        res.send(imageBuffer.image)
    }   
    catch (err){
        
        res.status(404).send(err)
    } 

    
})


router.get("/category/:id",async (req,res)=>{

    try{
        const imageBuffer = await Category.findById(req.params.id,{image : 1})
 
        res.set('Content-Type','image/png');
        res.send(imageBuffer.image)
    }   
    catch (err){
        
        res.status(404).send(err)
    } 

    
})






module.exports = router;