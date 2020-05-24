const mongoose = require("mongoose");

const zeroNumber  ={
    type: Number,
    default: 0,
  }

const SalesSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    image:{
        type : Buffer,
        required : true
    },
    views : zeroNumber,
    itemsSold : zeroNumber,
    discount : {
        ...zeroNumber,
        validate : {
            validator : (val)=>{
                if (val > 100 || val < 0) {
                    throw new Error("Discount is not Valid");
                  }
            }
        }
    },
    status : {
        type : Boolean,
        default : false
    },
    items : []
},{
    timestamps : true
});

SalesSchema.methods.toJSON = function(){
    sale = this.toObject();

    sale.image = `/api/serveImage/sale/${sale._id}`

    return sale;
}


const Sales = mongoose.model("sale",SalesSchema);

module.exports = Sales;