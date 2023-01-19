var mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    username: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{strictQuery : false});

module.exports = mongoose.model("User",UserSchema);

//create user registrations and check for user login and redirect them on home page
// before save you have to check for user existance
//find schema unique key to store unique values in collection