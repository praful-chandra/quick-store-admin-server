const mongoose = require("mongoose");
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
    status: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    for:{
      type : String,
      required : true
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
      ref: "category",
      required: true,
    },
    description: String,
    avaliableSizes : []
  },
  {
    timestamps: true,
  }
);

ProductsSchema.pre("remove", async function (next) {
  const Categories = require("./category.model");
  const prod = this;
  const cate = await Categories.findById({ _id: this.categoryId });
  cate.Products = cate.Products.filter((id) => !id.equals(prod._id));

  await cate.save();
  next();
});

ProductsSchema.methods.toJSON = function () {
  const product = this.toObject();

  product.image = `/api/serveImage/product/${product._id}`;


  return product;
};

const Products = mongoose.model("product", ProductsSchema);

module.exports = Products;
