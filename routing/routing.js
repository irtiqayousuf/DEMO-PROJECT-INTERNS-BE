const express =  require('express');
const router = express.Router();
var myFunc = require('../functions/getData');
const posts = require('../models/posts');
var Posts = require("../models/posts");
var User = require("../models/user");
// import User from "../models/user";

router.get("/",(req,res)=>{
    res.send("Hello World!")
});

router.get("/posts",(req,res)=>{
    response = {
        data : [
            { id : 1 , name : "ABC" , post : "Hello how are you" },
            { id : 2 , name : "DEF" , post : "Hello how are you" },
            { id : 3 , name : "GHI" , post : "Hello how are you" },
            { id : 4 , name : "JKL" , post : "Hello how are you" },
        ]
    }
    res.send(JSON.stringify(response));
    // res.send(`POSTS API ${req.param('name')}`)
})


router.get("/messages",(req,res)=>{
    res.send("Messages API" + req.ip)
})

router.get("/comments",(req,res)=>{
    res.send("Comments API" + req.baseUrl)
})


// www.mydomain.com/messages/search?id=12   | query string   of type get
router.get("/users",(req,res)=>{
    res.send("GET Users API")
})

// post has a data of body type which is not of type query | url and payload(data)
// Content-Type: application/x-www-form-urlencoded   == if we send data via form action or we specify content type : bodyparser.urlencoded()  in app.use()
router.post("/users",(req,res)=>{
    // console.log("Req Body ",req.body.username);
    var username = req.body.username;
    var dataResponse = myFunc.getData(username);
    res.send(dataResponse);
    // res.send(`POST Users API ${postFirstName} `);
})

router.get("/getPosts",async (req,res)=>{
    // res.send("Hello i'm in getPosts");
    Posts.find({},(err,posts)=>{
        if(err){
            res.send("error");
        }
        res.json(posts);        
    });

});


router.get("/createPost",(req,res)=>{
    const newPost = new Posts();
    newPost.title = "Hello this is a new Title from VS Code";
    newPost.desc = "Hello we are writing a new post description and saving this post from vs code via mongoose schema in mongodb";
    newPost.save((err,post)=>{
        if(err){
            res.send("some error");
        }
        else{
            if(post._id){
                res.send("Post Created Successfully")
            }
            else{
                res.send("some error in creating this post");
            }
            // res.json(post);
        }
    })

})


router.post("/createUser",(req,res)=>{
    const { name, email, password } = req.body;
    User.create({name , email, password},(error, user) => {
        if(error){
            res.send("Cannot create user");
        }
        else{
            res.json(user);
        }
    });

})

module.exports = router;
