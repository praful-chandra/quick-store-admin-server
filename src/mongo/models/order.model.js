const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Types.ObjectId,
    reduired: true,
  },
  totalAmt: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },

  orderStatus: {
    type: String,
    default: "initialized",
  },
  orderNote: String,
  items: [
    {
      itemId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
