const express = require("express");
const router = express.Router();
const cors = require("cors");
// var myFunc = require('../functions/getData');
const posts = require('../models/posts');
var Posts = require("../models/posts");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
var User = require("../models/user");
var Admin = require("../models/admin");
var Customer = require("../models/customer");
var Token = require("../models/cusToken");
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
const twilio = require('twilio');
const otpGenerator = require('otp-generator');
var OTP = require("../models/otp");
// const requireLogin = require('../middleware/requireLogin')
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
var db = require("../config/database.js");
const secret_key = process.env.JWT_TOKEN_KEY;
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



router.post("/createUser", (req, res) => {
    const { name, email, password, phone } = req.body;
    console.log("Plain Password ", password);
    let enPass = bcrypt.hashSync(password, salt);

    console.log("Enc Password ", enPass);

    User.create({ name, email, password: enPass, phone }, (error, user) => {
        if (error) {
            res.send("Cannot create user");
        }
        else {
            res.json(user);
        }
    });
});

router.post("/saveCustomer", (req, res) => {
    const { plan, website, name, phone, email } = req.body;
    Customer.findOne({ email: email }, (err, customer) => {
        if (customer) {
            res.send({ message: "Email Already Registered" })
        } else {
            Customer.create({ plan, website, name, phone, email }, (error, customer) => {
                if (error) {
                    res.send("Cannot create customer");
                }
                else {
                    res.json(customer);
                }
            })
        }
    });
});

router.post("/saveAdmin", (req, res) => {
    const { role, name, phone, email, password } = req.body;
    Admin.findOne({ email: email }, (err, admin) => {
        if (admin) {
            res.send({ message: "Email Already Registered" })
        } else {
            Admin.create({ role, name, phone, email, password }, (error, admin) => {
                if (error) {
                    res.send("Cannot create customer");
                }
                else {
                    res.json(admin);
                }
            })
        }
    });
});

router.post("/saveToken", (req, res) => {
    const { token } = req.body;
    Token.create({ token }, (error, token) => {
        if (error) {
            res.send("Cannot create token");
        }
        else {
            res.json(token);
        }
    });
});



router.post("/loginUser", (req, res) => {
    let responseObj = { data: "", message: "", status: "", error: "" };
    const { email, password } = req.body;
    User.findOne({ email }, (error, user) => {
        if (error) {
            responseObj.message = "Something went wrong";
            responseObj.status = 400;
            responseObj.error = true;
            res.json(responseObj);
        } else
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    responseObj.data = user;
                    responseObj.status = 200;
                    responseObj.error = false;
                    responseObj.token = generateToken(email);
                    res.json(responseObj);
                }
                else {
                    responseObj.message = "Invalid Password";
                    responseObj.status = 200;
                    responseObj.error = true;
                    res.json(responseObj);
                }
            }
            else {
                responseObj.message = "Invalid Username/Password";
                responseObj.status = 200;
                responseObj.error = true;
                res.json(responseObj);
            }
    });
});


router.post("/AdminUser", (req, res) => {
    //if we have to get anything from headers of API : 
    //req.header("Authorization"); // we have to remove Bearer from token string
    let responseObj = { data: "", message: "", status: "", error: "" };
    const { email, password } = req.body;
    console.log("line 169", req.body)
    Admin.findOne({ email }, (error, admin) => {
        console.log("line 171", admin);
        if (error) {
            responseObj.message = "Something went wrong";
            responseObj.status = 400;
            responseObj.error = true;
            res.json(responseObj);
        }
        else if (admin) {
            if (password === "1234", (err, res) => {
                console.log(res);
                console.log("line no. 183", err);
            }) {
                responseObj.data = admin;
                responseObj.status = 200;
                responseObj.error = false;
                responseObj.token = generateToken(email);
                res.json(responseObj);
            }
            else {
                responseObj.message = "Invalid Password";
                responseObj.status = 200;
                responseObj.error = false;
                res.json(responseObj);
            }
        }
        else {
            responseObj.message = "Invalid Username/Password";
            responseObj.status = 200;
            responseObj.error = true;
            res.json(responseObj);
        }
    });
});


const generateToken = (data) => {
    const token = jwt.sign(data, jwt_key);
    return token;
}

const validateToken = (token) => {
    try {
        const isVerified = jwt.verify(token, jwt_key);
        if (isVerified) {
            return 200;
        }
        else {
            return 401;
        }
    } catch (err) {
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
                        port: process.env.EMAIL_PORT,
                        secure: process.env.SECURE,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASS,
                        },
                    });

                    const mailOptions = {
                        from: process.env.USER,
                        to: user.email,
                        subject: `Password Reset Request`,
                        html: `Dear User,<br/>`
                            + ` You have requested for password reset.Please click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password<br/>`
                            + `Regards<br/>`
                            + `E-Auth Provider`
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
    console.log("new password", newPassword);
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({ message: "Password Updated Successfully" })
                    res.status(200);

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

router.get("/pricing", (req, res) => {
    response = {
        url: [
            { id: 1, title: "Free", subtitle: "The free plan offers a generous allowance of up to 60 free one-time passwords (OTP) for our valued site owners. With this plan, users can easily register themselves in our system and gain access to our API..  By signing up, individuals can unlock a range of benefits and utilize our services to enhance their online experience.", subtitle2: "It is for securing their accounts, facilitating secure transactions, or enhancing user verification, our free plan provides an ample supply of 60 OTPs, enabling site owners to safeguard their platforms and provide a secure environment for their users.", price_id: "Free" },
            { id: 2, title: "Paid", subtitle: "In this paid plan, we offer an incredible feature that allows users to generate as many OTPs as they need for their site. By subscribing to this plan for a nominal fee of ₹ 300 per month, users gain unlimited access to our robust OTP service. With this plan, individuals can easily register themselves in our system and seamlessly integrate our APIs into their workflows", subtitle2: "It is for securing user accounts, facilitating secure transactions, or enhancing user verification, our paid plan provides an unlimited supply of OTPs, enabling site owners to bolster their platforms' security and provide a seamless user experience.", price_id: "Pay ₹ 300" },
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


// router.post('/token', (req, res) => {
//     const { name } = req.body;

//     // Generate a random hash key
//     const hash = crypto.randomBytes(32).toString('hex');

//     // Store the hash key in the database
//     Customer.findOneAndUpdate({ name }, { hash }, { upsert: true })
//         .then(() => {
//             // Return the hash key as the API access token
//             res.json({ token: hash });
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(500).json({ error: 'Failed to generate token' });
//         });
// });

router.get('/getCustomers', async (req, res) => {

    //    var coll= db.collection('customer');
    //    coll.find({}).toArray(function (err,result) {
    //       if(er
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

router.get("/customer/getToken/:id", async (req, res) => {
    try {
        const cus = await Customer.findById(req.params.id);
        res.send(cus);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.post('/generateToken', (req, res) => {
    const { email, phone } = req.body;
    console.log("line 481", email);
    const token = jwt.sign({ email, phone }, 'secret-key');
    const newToken = new Token({ email, token, phone });
    newToken.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error saving token');
        } else {
            res.send({ token });
        }
    });

});

router.post('/checkToken', (req, res) => {
    const { token } = req.body;
    Token.findOne({ token: token }, (err, token) => {
        if (err) {
            console.error('Error:', err);
            res.sendStatus(500);
            res.message("Invalid or Incorrect Token");
        } else if (token) {
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
            res.message("Invalid or Incorrect Token");
        }
    });
});


router.post("/comp-otp", (req, res) => {

    let responseObj = { data: "", message: "", status: "", error: "" };
    const { otp, phone } = req.body;
    console.log("line 251", req.body)

    const accountSid = "AC485dc61a4f588f50c3795ff671b2730a";
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = "VA25a70a8e18259f3557706f227ed75ce9";
    const client = require("twilio")(accountSid, authToken);

    client.verify.v2.services(verifySid)
        .verificationChecks
        .create({ to: `+91${phone}`, code: otp })
        .then((verificationCheck) => {
            if (verificationCheck.status === "approved") {
                // OTP is correct
                responseObj.message = "OTP verification successful";
                responseObj.status = 200;
                responseObj.error = false;
                res.json(responseObj);
                console.log("Successful")
            } else {
                // OTP is incorrect
                responseObj.message = "Invalid OTP";
                responseObj.status = 400;
                responseObj.error = true;
                res.json(responseObj);
                console.log("otp Invalid OTP");
            }
        })
        .catch((error) => {
            responseObj.message = "Something went wrong";
            responseObj.status = 400;
            responseObj.error = true;
            res.json(responseObj);
        });
});


router.post('/api/verify', async (req, res) => {

    let responseObj = { data: "", message: "", status: "", error: "" };
    const { phone } = req.body;
    console.log("line 169", req.body)
    Token.findOne({ phone }, (error, token) => {
        console.log("msg 564", phone);
        if (error) {
            responseObj.message = "Something went wrong";
            responseObj.status = 400;
            responseObj.error = true;
            res.json(responseObj);
        }
        else if (token) {
            responseObj.data = token;
            responseObj.status = 200;
            responseObj.error = false;
            res.json(responseObj);


            verificationOtpProvider(phone);

        }
        else {
            responseObj.message = "Invalid Number";
            responseObj.status = 200;
            responseObj.error = false;
            res.json(responseObj);
        }
    });



    function verificationOtpProvider(phone) {
        const accountSid = "AC485dc61a4f588f50c3795ff671b2730a";
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const verifySid = "VA25a70a8e18259f3557706f227ed75ce9";
        const client = require("twilio")(accountSid, authToken);


        client.verify.v2
            .services(verifySid)
            .verifications.create({ to: `+91${phone}`, channel: "sms" })
            .then((verification) => console.log(verification.status))
            .then(() => {
                const readline = require("readline").createInterface({
                    input: process.stdin,
                    output: process.stdout,

                });



                //   readline.question("Please enter the OTP:", (otp) => {
                //     client.verify.v2
                //       .services(verifySid)
                //       .verificationChecks.create({ to: `+919469313239`, code: otp })
                //       .then((verification_check) => console.log(verification_check.status))
                //       .then(() => readline.close());
                //   });

            });
    }
})




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













