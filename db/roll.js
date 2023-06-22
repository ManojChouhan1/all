const mongoose = require("mongoose");

const rollSchemas = new mongoose.Schema({
    name : {
        type :String,
        required:true
    },
    discription : {
        type :String,
        // required : true,
        unique: true
    }
})
module.exports = mongoose.model("rolls", rollSchemas)