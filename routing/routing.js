const express =  require("express");
const router = express.Router();
const cors = require("cors");
var myFunc = require('../functions/getData');
const posts = require('../models/posts');
var Posts = require("../models/posts");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
var  User  = require("../models/user");
var  Admin  = require("../models/admin");
var  Customer  = require("../models/customer");
var  CusToken  = require("../models/cusToken");
var dotenv = require("dotenv");
dotenv.config();
var bcrypt = require("bcryptjs");
const salt = 10;
const SMTPServer = require("smtp-server").SMTPServer;
const nodemailer = require('nodemailer');
const BCRYPT_SALT_ROUNDS = 12;
const crypto = require("crypto");
let jwt_key = process.env.JWT_TOKEN_KEY;
var jwt = require("jsonwebtoken");
// const requireLogin = require('../middleware/requireLogin')
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
var db= require("../config/database.js");

// email config

// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:process.env.EMAIL,
//         pass:process.env.PASSWORD
//     }
// }) 

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

router.post("/saveCustomer",(req,res)=>{
    const { plan,website, name, phone,email } = req.body;
    Customer.findOne({email : email},(err,customer)=>{
        if(customer){
            res.send({message:"Email Already Registered"})
        }else{
    Customer.create({plan ,website, name, phone, email},(error, customer) => {
        if(error){
            res.send("Cannot create customer");
        }
        else{
            res.json(customer);
        }
    })
}
    });
});

router.post("/saveAdmin",(req,res)=>{
    const { role,name, phone, email,password } = req.body;
    Admin.findOne({email : email},(err,admin)=>{
        if(admin){
            res.send({message:"Email Already Registered"})
        }else{
    Admin.create({role,name, phone, email,password },(error, admin) => {
        if(error){
            res.send("Cannot create customer");
        }
        else{
            res.json(admin);
        }
    })
}
    });
});

router.post("/saveToken",(req,res)=>{
    const { token } = req.body;
    Token.create({token},(error, token) => {
        if(error){
            res.send("Cannot create token");
        }
        else{
            res.json(token);
        }
    });
});



router.post("/loginUser", (req,res)=>{
    //if we have to get anything from headers of API : 
    //req.header("Authorization"); // we have to remove Bearer from token string
    let responseObj = { data : "", message : "", status : "", error : "" };
    const { email, password } = req.body;
    console.log("line 169",req.body)
    User.findOne({email},(error, user) => {
        console.log("line 171",user);
        if(error){
            responseObj.message = "Something went wrong";
            responseObj.status = 400;
            responseObj.error = true;
            res.json(responseObj);
        }
        else if(user){
            if(bcrypt.compare(password,user.password,(err,res)=>{
                console.log(res);
                console.log("line no. 183",err);
            })){
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

router.post("/AdminUser", (req,res)=>{
    //if we have to get anything from headers of API : 
    //req.header("Authorization"); // we have to remove Bearer from token string
    let responseObj = { data : "", message : "", status : "", error : "" };
    const { email, password } = req.body;
    console.log("line 169",req.body)
    Admin.findOne({email},(error, admin) => {
        console.log("line 171",admin);
        if(error){
            responseObj.message = "Something went wrong";
            responseObj.status = 400;
            responseObj.error = true;
            res.json(responseObj);
        }
        else if(admin){
            if(password === "1234",(err,res)=>{
                console.log(res);
                console.log("line no. 183",err);
            }){
                responseObj.data = admin;
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



// // Generate a JWT access token for the user
// const token = jwt.sign({ email: customer.email, id: customer._id }, 'access_api_custommer', { expiresIn: '1h' });
// const updatedUser = await Customer.findOneAndUpdate(
//     { _id: customer._id },
//     { $set: { accessToken: token } },
//     { new: true }
//   );

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }

        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User doesnt exists with given email" })
                }

                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.markModified('resetToken')
                user.markModified('expireToken')
                user.save().then((result) => {
                   
                        // to: user.email,
                        // from: process.env.SENDGRID_EMAIL,
                        // subject: 'Password Reset',
                        // html: `
                        // <p>You have requested for password reset</p>
                        // <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                        // `
                        const transport = nodemailer.createTransport({
                            host: process.env.HOST,
                            service: process.env.SERVICE,
                            port:process.env.EMAIL_PORT,
                            secure:process.env.SECURE,
                            auth: {
                              user: process.env.USER,
                              pass: process.env.PASS,
                            },
                          });
                
                          const mailOptions = {
                            from: process.env.USER,
                            to: user.email,
                            subject: `Password Reset Request`,
                            html: `
                            <p>You have requested for password reset</p>
                            <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                            `
                          };
                
                          transport.sendMail(mailOptions, (error, info) => {
                            if (error) {
                              return res.status(400).json({ message: "Error" });
                            }
                            return res.status(200).json({ message: "Email Sent" });
                          });
                    

                    res.json({ message: "check your mail" })
                })
            })
    })
})

router.post('/new-password/:token', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token

    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again! Session may expired" })
            }

            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.markModified('password')
                user.markModified('resetToken')
                user.markModified('expireToken')
                user.save().then((saveduser) => {
                    res.json({ message: "password updated successfully" })
                })
            })

        }).catch(err => {
            console.log(err)
        })
})



// router.get("/new-password/:token", async (req, res) => {
//     const { _id,token } = req.params;
//     console.log(req.params);
//     const oldUser = await User.findOne({ _id: id });
//     if (!oldUser) {
//       return res.json({ status: "User Not Exists!!" });
//     }
//     const secret = JWT_SECRET + oldUser.password;
//     try {
//       const verify = jwt.verify(token, secret);
//       res.render("index", { email: verify.email, status: "Not Verified" });
//     } catch (error) {
//       console.log(error);
//       res.send("Not Verified");
//     }
//   });
  
//   router.post("/new-password/:token", async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;
  
//     const oldUser = await User.findOne({ _id: id });
//     if (!oldUser) {
//       return res.json({ status: "User Not Exists!!" });
//     }
//     const secret = JWT_SECRET + oldUser.password;
//     try {
//       const verify = jwt.verify(token, secret);
//       const encryptedPassword = await bcrypt.hash(password, 10);
//       await User.updateOne(
//         {
//           _id: id,
//         },
//         {
//           $set: {
//             password: encryptedPassword,
//           },
//         }
//       );
  
//       res.render("index", { email: verify.email, status: "verified" });
//     } catch (error) {
//       console.log(error);
//       res.json({ status: "Something Went Wrong" });
//     }
//   });
  
router.get("/pricing",(req,res)=>{
    response = {
        url : [
            { id : 1 , title : "Basic" ,    subtitle: "The professional plan adds features such as multifactor authentication, admin roles, the ability to connect an external database, and up to 10 Actions.", subtitle2: "The professional plan adds features such as multifactor authentication, admin roles, the ability to connect an external database, and up to 10 Actions.", price_id: "Free"},
            { id : 2 , title : "Standard", subtitle: "The professional plan adds features such as multifactor authentication, admin roles, the ability to connect an external database, and up to 10 Actions.", subtitle2: "The professional plan adds features such as multifactor authentication, admin roles, the ability to connect an external database, and up to 10 Actions.", price_id: "Pay ₹ 300"},
            { id : 3 , title : "Premium",  subtitle: "The professional plan adds features such as multifactor authentication, admin roles, the ability to connect an external database, and up to 10 Actions.",subtitle2: "The professional plan adds features such as multifactor authentication, admin roles, the ability to connect an external database, and up to 10 Actions.", price_id: "Pay ₹ 500"},
        ]
    }
    res.send(JSON.stringify(response));
    // res.send(`POSTS API ${req.param('name')}`)
})


router.get('/user/profile/:id', async (req, res) => {

    try {
      const user = await User.findById(req.params.id);
      res.send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


  router.post('/token', (req, res) => {
    const { name } = req.body;
  
    // Generate a random hash key
    const hash = crypto.randomBytes(32).toString('hex');
  
    // Store the hash key in the database
    Customer.findOneAndUpdate({ name }, { hash }, { upsert: true })
      .then(() => {
        // Return the hash key as the API access token
        res.json({ token: hash });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate token' });
      });
  });

  
router.get('/getCustomers', async (req, res) => {
     
    //    var coll= db.collection('customer');
    //    coll.find({}).toArray(function (err,result) {
    //       if(err){
    //         res.send(err);
    //       } else{
    //           res.send(JSON.stringify(result));
    //       }
    //    })
    try {
        const customer = await Customer.find({});
        res.send(JSON.stringify(customer));
      } catch (error) {
        res.status(500).send(error.message);
      }
  });
  
  router.get("/customer/getToken/:id", async (req,res)=>{
    try{
        const cus= await Customer.findById(req.params.id);
        res.send(cus);
        
    } catch (error){
        res.status(500).send(error.message);
    }
})


router.post('/generateToken', (req, res) => {
    const email = req.body.email;
    console.log("line 281",email);
    const token = jwt.sign({ email }, 'secret-key');
    const newToken = new CusToken({ email, token });
    newToken.save((err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error saving token');
      } else {
        res.send({ token });
      }
    });

  });

module.exports = router;














// user logout

// router.get("/logout",authenticate,async(req,res)=>{
//     try {
//         req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
//             return curelem.token !== req.token
//         });

//         res.clearCookie("usercookie",{path:"/"});

//         req.rootUser.save();

//         res.status(201).json({status:201})

//     } catch (error) {
//         res.status(401).json({status:401,error})
//     }
// });








 




