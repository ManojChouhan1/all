const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    emailId: { type: String, unique: true ,required:true},
    collegeId: String,
    mobileNo: String,
})
module.exports = mongoose.model("students",studentSchema)