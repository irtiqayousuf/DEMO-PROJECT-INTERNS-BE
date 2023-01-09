var http = require("http");


http.createServer(function(request, response){

    console.log("Request");
    response.write("Hello world from http node server <p>Hello i am in paragraph</p> "+ request.url);
    response.end();


}).listen(9090,()=>{ console.log("Server Started on 9090") });

// npm i nodemon