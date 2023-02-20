var mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    role:{
        type: String,
        default:true
    },
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
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
},{collection:"admin"});
  
module.exports = mongoose.model("Admin",AdminSchema );













