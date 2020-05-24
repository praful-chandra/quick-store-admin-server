const mongoose = require("mongoose");
const Product = mongoose.model("product");

// const checkProduct = async prodId =>await Product.findById(prodId);

module.exports = async (prodList) => {
  let productsExist;

  prodList = prodList.map((item) => {
    if (mongoose.isValidObjectId(item)) return item;
  });

  productsExist = await Product.find({ _id: { $in: prodList } }, { _id: 1 , name:1 });

  

  const productsFinal = productsExist.map((data) =>
  (  {_id : data._id,
      name : data.name,
      image : `/api/serveImage/product/${data._id}`
    })
  );

  return productsFinal;
};
