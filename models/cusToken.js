const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cusTokenSchema = new Schema({
	phone: {
        type: String,
        required : true
    },
	email:{
        type:String,
		required:true
	},
	token: { type: String,
		 required: true
	 },
	// createdAt: { type: Date, 
	// 	default: Date.now,
	// 	},
},{collection:"Custoken"});

module.exports = mongoose.model("CusToken", cusTokenSchema);












