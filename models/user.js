var mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken:String,
    expireToken:Date,
    phone: {
        type: Number,
        required: true
    },
},{collection:"user"});

module.exports = mongoose.model("User",UserSchema);





