const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new mongoose.Schema({
    phone: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300 // expires in 5 minutes (300 seconds)
    }
  },{collection:"Otp"});

module.exports = mongoose.model("OTP", otpSchema)