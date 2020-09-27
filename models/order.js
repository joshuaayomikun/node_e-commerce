const mongoose = require("mongoose");
const user = require("./user");
const product = require("./product");
const OrderSchema = mongoose.Schema({
    orderNo: String,
    user,
    product,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    }
})

module.exports = mongoose.model("orders", OrderSchema);