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
},{collection:"posts"});

module.exports = mongoose.model("Posts",PostsSchema);