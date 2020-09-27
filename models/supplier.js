const mongoose = require("mongoose");
const SupplierSchema = mongoose.Schema({
    name:  String
})

module.exports = mongoose.model("suppliers", SupplierSchema);