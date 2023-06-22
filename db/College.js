const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
    collegeName : {type : String,   unique: true },
    address: String,
    mobileNo : Number,
    city: String,
    state: String
});

module.exports = mongoose.model("colleges",collegeSchema)