var mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    website: {
        type: String,
        required : true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    plan: {
        type: String,
        default:true
    },
    email:{
       type: String,
       required: true,
       unique: true
    },
    token:String
},{collection:"customer"});

module.exports = mongoose.model("Customer",CustomerSchema);