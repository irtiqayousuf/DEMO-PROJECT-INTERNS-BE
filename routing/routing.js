const express =  require("express");
const router = express.Router();
var myFunc = require('../functions/getData');
const posts = require('../models/posts');
var Posts = require("../models/posts");
var { User } = require("../models/user");
var bcrypt = require("bcryptjs");
const salt = 10;
var jwt = require("jsonwebtoken");

// router.get("/",(req,res)=>{
//     res.send("Hello World!")
// });


router.get('/cards',(req,res)=>{
    response = {
        data : [
            { id : 1 , title : "Kashmir" , text : "The Kashmir region is predominantly mountainous, with deep, narrow valleys and high, barren plateaus. The relatively low-lying Jammu and Punch (Poonch) plains in the southwest are separated by the thickly forested Himalayan foothills and the Pir Panjal Range of the Lesser Himalayas from the larger, more fertile, and more heavily populated Vale of Kashmir to the north.", url : "https://picsum.photos/seed/picsum/200/300"},
            { id : 2 , title : "Jammu" , text : "Jammu is mentioned by name in the chronicles of Timur (r. 1370–1406), who invaded Delhi in 1398 and returned to Samarkand via Jammu. In the Mughal chronicles of Babur in the early 16th century, Jammu is mentioned as a powerful state in the Punjab hills. It is said to have been ruled by Manhas Rajputs. Emperor Akbar brought the hill kingdoms.", url : "https://www.pexels.com/photo/green-grass-near-trees-1770809/"},
            { id : 3 , title : "Ladakh" , text : "Ladakh is a region administered by India as a union territory which constitutes a part of the larger Kashmir region and has been the subject of dispute between India, Pakistan, and China since 1947. adakh is most famous for breathtaking landscapes, the crystal clear skies, the highest mountain passes, thrilling adventure activities, Buddhist Monasteries and festivals.", url : "https://www.pexels.com/photo/a-man-wearing-red-jacket-doing-peace-sign-3225529/" },
            { id : 4 , title : "Srinagar" , text : "abc@gmail.com", url : "http://localhost:3000/src/natureHome.jpg"},
        ]
    }

    res.send(JSON.stringify(response));
})

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
    let token = req.param("token");
    if(!token){
        res.send("Token not found");
    }
    let val = validateToken(token);
    console.log("Val ",val);
    if(val === 401){
        res.status(401).send("Access Token is not valid");
    }
    else{
        Posts.find({},(err,posts)=>{
            if(err){
                res.send("error");
            }
            res.json(posts);        
        });
    }

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
    const { name, email, password,phone } = req.body;
    console.log("Plain Password " ,password);
    let enPass =  bcrypt.hashSync(password,salt);
    console.log("Enc Password " ,enPass);

    User.create({name , email, password : enPass, phone},(error, user) => {
        if(error){
            res.send("Cannot create user");
        }
        else{
            res.json(user);
        }
    });
});


router.post("/loginUser", (req,res)=>{
    //if we have to get anything from headers of API : 
    //req.header("Authorization"); // we have to remove Bearer from token string
    let responseObj = { data : "", message : "", status : "", error : "" };
    const { email, password } = req.body;
    User.findOne ({email},(error, user) => {
        if(error){
            responseObj.message = "Something went wrong";
            responseObj.status = 400;
            responseObj.error = true;
            res.json(responseObj);
        }
        else if(user){
            if(bcrypt.compareSync(password,user.password)){
                responseObj.data = user;
                responseObj.status = 200;
                responseObj.error = false;
                responseObj.token = generateToken(email);
                res.json(responseObj);
            }
            else{
                responseObj.message = "Invalid Password";
                responseObj.status = 200;
                responseObj.error = false;
                res.json(responseObj);
            }
        }
        else{
            responseObj.message = "Invalid Username/Password";
            responseObj.status = 200;
            responseObj.error = true;
            res.json(responseObj);
        }
    });
});


const generateToken = (data) => {
    const token = jwt.sign(data,jwt_key);
    return token;
} 

const validateToken = (token) => {
    try{
        const isVerified = jwt.verify(token,jwt_key);
        if(isVerified){
            return 200;
        }
        else{
            return 401;
        }
    }catch(err){
        return 401;
    }

} 

// router.post("/login", (req, res)=> {
//     const { email, password} = req.body;
//     User.findOne({ email: email}, (err, user) => {
//        if(users){
//            if(bcrypt.compareSync(password === users.password)) {
//                res.send({message: "Login Successfull" , user : user})
//            } else {
//                res.send({ message: "Invalid UserName/Password"})
//             }        
//            }else {
//           res.send({message: "User not registered"})
//         }
//     })
// }) 





// router.post("/createUsers", (req, res)=> {
//     const { name, email, password, phone} = req.body
//     User.findOne({email: email}, (err, user) => {
//           if(user){
//            res.send({message: "User already registerd"})
//         } else {
//             const Users = new Users({name,email,password,phone})
//             Users.save(err => {
//                 if(err) {
//                     res.send(err)
//                 } else {
//                     res.send( { message: "Successfully Registered, Please login now." })
//                 }
//             })
//         }
//     })
   
// }) 




module.exports = router;



 




