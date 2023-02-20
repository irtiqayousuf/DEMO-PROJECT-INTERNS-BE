var mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    plan: {
        type: String,
        default:true
    },
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
    email:{
       type: String,
       required: true,
       unique: true
    },
},{collection:"customer"});

module.exports = mongoose.model("Customer",CustomerSchema);