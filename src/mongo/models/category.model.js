const mongoose = require("mongoose");

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

const Category = mongoose.model("category", CategorySchema);
module.exports = Category;
