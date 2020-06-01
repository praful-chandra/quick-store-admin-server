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
},{
  timestamps : true
});

CategorySchema.pre("remove",async function(next){
    
  this.Products.map(async prod=>{
    await Products.findByIdAndRemove(prod);
  })

  next();
})

CategorySchema.methods.toJSON = function(){
  const category = this.toObject();

 category.image = `/api/serveImage/category/${category._id}`
  return category;
}

const Category = mongoose.model("category", CategorySchema);
module.exports = Category;
