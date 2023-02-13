
require("dotenv").config();
require('./config/database.js').connect();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors   = require("cors");
var router = require('./routing/routing')
var dotenv = require("dotenv");
dotenv.config();
var port = process.env.PORT || 8080;
app.use(express.json());
app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(router);

app.listen(port,()=>{
    console.log(`App is running at Port ${port}`);
})


