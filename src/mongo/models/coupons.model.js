const mongoose = require("mongoose");

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
    remainingCoupons:{
        type : Number,
        default : 0
    },
    items : [],
    upTo :{
        type : Number,
        default : 0
    },
    expiry: Date
},{
    timestamps : true
})

const Coupon = mongoose.model("coupon",couponSchema);

module.exports = Coupon;