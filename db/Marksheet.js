const  mongoose  = require("mongoose");

const markSchema = new mongoose.Schema({
    name : String,
    studentId : {type:String, unique: true},
    rollNo : {type:String, unique: true},
    physics : String,
    chemistry : String,
    maths : String,
})

module.exports = mongoose.model("marksheets",markSchema);