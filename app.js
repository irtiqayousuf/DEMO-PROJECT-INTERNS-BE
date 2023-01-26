// var http = require("http");


// http.createServer(function(request, response){

//     console.log("Request");
//     response.write("Hello world from http node server <p>Hello i am in paragraph</p> "+ request.url);
//     response.end();


// }).listen(9090,()=>{ console.log("Server Started on 9090 check") });

// // npm i nodemon

//method  GET/POST/
//authorization & server side rendering  || functions  \\


require("dotenv").config();
require('./config/database').connect();
// var connect = require('./config/database');
// connect();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors   = require("cors");
var router = require('./routing/routing')
var dotenv = require("dotenv");
dotenv.config();
var port = process.env.PORT || 8080;

app.use(cors());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(router);

app.listen(port,()=>{
    console.log(`App is running at Port ${port}`);
})


//user --- spedcific to users only 
//admin --- on admin related api's and function
//common  

//model
//  user = {
//     int id;
//     char name[];
//     string address;
//     string gender
// }


// req.body  == { name :  "", age : xx , gender : "" }
// let userData = req.body:USER 
// models  USER : { name : type, age: type, gender : type}

//sql  structured query language (mysql | sql | postgres) INSERT into table (columns) VALUES (ABC); RDMS  -- RDMS -- primary foreign keys data int the form of tables rows and columns
//no sql -- non structured query language | their is no RDBMS , no tables, data is in the JSON format  || mongodb | couchdb 


//App - Login - Register - Homepage
//JWT | JSON Web Tokens (jwt.io)  || only for providing a secure token to verify user
//Password -- encrypted in db (bcrypt.js)
//mongo db is a database (no-sql)
//mongoose client (lib) in nodejs to connect to mongodb   
// npm i mongoose jsonwebtoken dotenv bcryptjs


//environments : 1. localhost | Dev, 2. QA - Quality Assurance -Testing  ,3. UAT - Porduct Owner ,  4. Prod -- Live

//CI/CD   : continuous integration/ continuous development

// jwt // dotenv // authorization header


// task :  login and protected routes/ authorization in reactjs

//Pending things
// nodejs: controllers
// reactjs: routes -> protected routes | project setup
// react js / nodejs / mongodb 
// documentation of our project and project setup | 30th Project start date | E-Authorization System