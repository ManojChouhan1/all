const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName :String,
    lastName :String,
    loginId :{type:String, unique: true},
    password :String,
    rollId: { type: mongoose.Schema.Types.ObjectId, ref: 'rolls' }
})
 module.exports = mongoose.model("users",userSchema)