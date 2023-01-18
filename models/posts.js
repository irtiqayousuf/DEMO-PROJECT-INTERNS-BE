var mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    desc: {
        type: String,
        required : true
    }
},{strictQuery : false});

module.exports = mongoose.model("Posts",PostsSchema);