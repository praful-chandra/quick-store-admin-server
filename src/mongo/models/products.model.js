const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    image :{
        type : Buffer,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    price :{
        type : Number,
        required : true
    },
    discount :{
        type :Number,
        default : 0,
        validate : {
            validator : (val)=>{
                
                if (val > 100 || val < 0) {
                    throw new Error("Discount is not Valid");
                  }
            }
        }
    },
    categoryId :{
        type : mongoose.Types.ObjectId,
        required : true
    },

})

const Products = mongoose.model("product",ProductsSchema);

module.exports = Products;