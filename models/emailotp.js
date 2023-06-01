const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cusTokenSchema = new Schema({
    email: {
        type: String,
        unique: true
      },
      otp: {
        type: String,
        required: true
      },
	createdAt: { type: Date, 
		default: Date.now,
		},
},{collection:"Emailotp"});

module.exports = mongoose.model("EmailOtp", cusTokenSchema);












