const mongoose = require("mongoose");
// const { MONGO_URI } = process.env;

const MONGO_URI = "mongodb+srv://irtiqa:irtiqa123@cluster0.blvqini.mongodb.net/Internship";
exports.connect = () => {

    mongoose.connect(MONGO_URI).then( () => {
        console.log("DB connected successfully");
    }).catch((error) => {
        console.log("Something went wrong while conecting to DB");
    });

}

// db = db.getSiblingDB("internship");
// db.getCollection("posts").find({});
// db.posts.insertOne({"title":"2nd","desc":"second post from studio 3t"})
// db.posts.insertOne({"title":"3rd","desc":"third post from studio 3t"})
// db.getCollection("posts").find({})
// db.posts.remove({"_id":ObjectId("63c6a8f31ecd082d0a8adfd8")})
// db.posts.updateOne({"_id":ObjectId("63c6a9dc1ecd082d0a8adfda")},{$set: {"desc" : "third post from studio 3t but updated"} })
// db.posts.findOne({"_id":ObjectId("63c6a9dc1ecd082d0a8adfda")})

//schema create
//data insert
// data get
// data update  (CRUD)
//find && query