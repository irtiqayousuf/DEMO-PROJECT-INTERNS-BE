const mongoose = require("mongoose");
// const { MONGO_URI } = process.env;
const MONGO_URI = "mongodb+srv://demo:demo123@cluster2.oo1jcdp.mongodb.net/internship";

exports.connect = () => {

    mongoose.connect(MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then( () => {
        console.log("DB connected successfully");
    }).catch((error) => {
        console.log("Something went wrong while conecting to DB");
    });

}

//schema create
//data insert
// data get
// data update  (CRUD)
//find && query