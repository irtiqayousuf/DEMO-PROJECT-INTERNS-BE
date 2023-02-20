const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cusTokenSchema = new Schema({
	
	email:{
        type:String,
		required:true
	},
	token: { type: String,
		 required: true
	 },
	createdAt: { type: Date, default: Date.now, expires: "2h" },
},{collection:"Custoken"});

module.exports = mongoose.model("CusToken", cusTokenSchema);












