const mongoose = require("mongoose");

const zeroNumber  ={
    type: Number,
    default: 0,
  }

const couponSchema = new mongoose.Schema({
    name:{
        type : String,
        required : false
    },
    code:{
        type :String,
        required : true,
        uppercase:true
    },
    status:{
        type : Boolean,
        default : false
    },
    remainingCoupons:zeroNumber,
    items : [],
    upTo :zeroNumber,
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
    expiry: Date
},{
    timestamps : true
})

const Coupon = mongoose.model("coupon",couponSchema);

module.exports = Coupon;