// var http = require("http");


// http.createServer(function(request, response){

//     console.log("Request");
//     response.write("Hello world from http node server <p>Hello i am in paragraph</p> "+ request.url);
//     response.end();


// }).listen(9090,()=>{ console.log("Server Started on 9090 check") });

// // npm i nodemon

//method  GET/POST/
//authorization & server side rendering  || functions  \\


var express = require("express");
var app = express();
var port = 8080;
var bodyParser = require("body-parser");
var cors   = require("cors");
var myFunc = require('./functions/getData');

app.use(cors());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.send("Hello World!")
});

app.get("/posts",(req,res)=>{

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



app.get("/messages",(req,res)=>{
    res.send("Messages API" + req.ip)
})

app.get("/comments",(req,res)=>{
    res.send("Comments API" + req.baseUrl)
})


// www.mydomain.com/messages/search?id=12   | query string   of type get
app.get("/users",(req,res)=>{
    res.send("GET Users API")
})

// post has a data of body type which is not of type query | url and payload(data)
// Content-Type: application/x-www-form-urlencoded   == if we send data via form action or we specify content type : bodyparser.urlencoded()  in app.use()
app.post("/users",(req,res)=>{
    // console.log("Req Body ",req.body.username);
    var username = req.body.username;
    var dataResponse = myFunc.getData(username);
    res.send(dataResponse);
    // res.send(`POST Users API ${postFirstName} `);
})






app.listen(port,()=>{
    console.log(`App is running at Port ${port}`);
})