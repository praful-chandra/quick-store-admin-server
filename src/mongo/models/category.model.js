const mongoose = require("mongoose");

const Products = require("./products.model");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
    required: true,
  },
  Products: [],
});

CategorySchema.pre("remove",async(next)=>{

  this.Products.map(async prod=>{
    await Products.findByIdAndRemove(prod);
  })

  next();
})

const Category = mongoose.model("category", CategorySchema);
module.exports = Category;
