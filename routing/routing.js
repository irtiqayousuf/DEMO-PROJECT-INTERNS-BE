const express =  require('express');
const router = express.Router();
var myFunc = require('../functions/getData');
var Posts = require("../models/posts");

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

router.get("/getPosts",(req,res)=>{
    res.send("Hello i'm in getPosts");
    Posts.find({"_id" : ObjectId("63c2a04a56f18b5dfc295676")},(err,posts)=>{
        // if(err){
        //     res.send("error");
        // }
        // res.send(posts);        
    });

});

module.exports = router;
