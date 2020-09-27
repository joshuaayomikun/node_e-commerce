const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    name: String,
    gender: {
        type: String,
        enum:["male", "female", "others"]
    },
    email: String,
    password: String,
    confirmEmailToken: String,
    status: {
        type: String,
        enum: ['notverified','notactive', 'active', 'resetpassword'],
        default:'notverified'
    },
    phoneNo: String,
    deliveryAddress: Array,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    }
})


module.exports = mongoose.model("users", UserSchema);