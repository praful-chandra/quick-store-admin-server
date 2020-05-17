const mongoose = require("mongoose");
const Category = require("./category.model");
const ProductsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: Buffer,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status:{
      type : Boolean,
      default :false
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      validate: {
        validator: (val) => {
          if (val > 100 || val < 0) {
            throw new Error("Discount is not Valid");
          }
        },
      },
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

ProductsSchema.pre("remove", async function (next) {
  const prod = this;
  const cate = await Category.findOne({ _id: this.categoryId });
  cate.Products = cate.Products.filter((id) => id !== prod._id);

  await cate.save();
  next();
});

const Products = mongoose.model("product", ProductsSchema);

module.exports = Products;
