const mongoose = require("mongoose");
const supplier = require("./supplier");
const user = require("./user");
const ProductSchema = mongoose.Schema({
    name: String,
    productNo:String,
    supplier,
    quantity: Number,
    productImage:{
        type: Buffer,
        contentType: String
    },
    creator: user,
    createdAt: {
    price: Number,
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    }
})

module.exports = mongoose.model("products", ProductSchema);