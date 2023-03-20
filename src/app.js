const express = require("express");
const bodyparser = require("body-parser");
const User = require("./models/register");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
require('./db/conn');

const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const path = require('path');
app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || 4000;



const sendVerifyMail = async(name, email, user_id) => {
    const transporter = nodemailer.createTransport({
       host: 'smtp.gmail.com',
       port: 587,
       secure: false,
       // requireTLS: true,
       auth: {
           user:'abhisharma6444.as@gmail.com',
           pass:'kohytbwrvxcjjivm',
       },
   });


   let info = await transporter.sendMail({
       from: 'abhisharma6444.as@gmail.com', // sender address
       to: email, // list of receivers
       subject: "For Verification of Account", // Subject line
       // text: "Hello world?", // plain text body
       html: '<p>Welcome '+name+' to the Canteen shop. Please click <a href= "http://localhost:'+port+'/register/verify?id='+user_id+'"> here </a> to Verify.</p>', // html body
     });

     console.log("Email sent successfully!");
}


const sendVerifyMail2 = async(name, email, address, order, price) => {
    const transporter = nodemailer.createTransport({
       host: 'smtp.gmail.com',
       port: 587,
       secure: false,
       // requireTLS: true,
       auth: {
           user:'abhisharma6444.as@gmail.com',
           pass:'kohytbwrvxcjjivm',
       },
   });


   let info = await transporter.sendMail({
       from: 'abhisharma6444.as@gmail.com', // sender address
       to: email, // list of receivers
       subject: "Order Details", // Subject line
       // text: "Hello world?", // plain text body
       html: '<p>Dear '+name+'! Your order has been placed. You ordered for '+order+' for ₹'+price+'</p>', // html body
     });

     console.log("Email sent successfully!");


     let info2 = await transporter.sendMail({
        from: 'abhisharma6444.as@gmail.com', // sender address
        to: 'gauravkarnor4@gmail.com', // list of receivers
        subject: "Customer Order", // Subject line
        // text: "Hello world?", // plain text body
        html: '<p>Hello!!! Customer'+name+'have placed an order of '+order+' for ₹'+price+' at Room No: '+address+'.</p>', // html body
      });
 
      console.log("Email sent successfully!");

}











app.get("/", async (req,res)=>{
    try{
        res.render("index2");
    }catch(error){
        res.status(400).send(error);
    }
})


app.get("/register", async (req, res) => {
    try{
        res.render("register");
    }catch(error){
        res.status(400).send(error);
    }
});

app.post("/register", async(req, res) => {

    try{
        if (req.body.password === req.body.reEnterpassword) {

            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                regnumber: req.body.regnumber,
                email: req.body.email,
                Hostelname: req.body.Hostelname,
                Roomnumber: req.body.Roomnumber,
                password: req.body.password,
                reEnterpassword: req.body.reEnterpassword,
                is_verified: 0
            });
            const registered = await newUser.save();
            sendVerifyMail(req.body.firstname, req.body.email, registered._id);
            res.render('index2',{message:"Your registration has been successfully done, Please verify your email now."}); 
        } else {
            console.log("Re-Enter password didn't matched");
            res.send("Sorry!!, Re-Enter password didn't matched");
        }
    }catch(error){
        res.status(400).send(error);
    }

    

});


app.get("/register/verify", async(req, res)=>{
    try {
        
        const updated = await User.updateOne({_id:req.query.id}, { $set: { is_verified:1 }});
        console.log("updated");
        res.render("email");
    } catch (error) {
        res.status(400).send("error");
    }
});




app.get("/login", async(req,res)=>{
    try{
        res.render("login");
    }catch(error){
        res.status(400).send("error");
    }
});

app.post("/login", async (req, res) => {
    try {
        const myuser = await User.findOne({ email: req.body.email });
        console.log(myuser.is_verified);
        const isMatch = bcrypt.compare(myuser.password, req.body.password);
        
            if(isMatch){
                if(myuser.is_verified){
                    res.render("index");
                    console.log("Successfully login");
                }else{console.log("user not registered!!!");}
            }else{
                console.log("Password didn't matched");
            }
    } catch (error) {
        console.log("not func");
        res.status(400).send(error);
    }
});


const List = [];

app.get("/tirath", (req,res)=>{
    res.render("tirath", {items: List});
});

app.post("/tirath", (req,res)=>{
    if(post.submit){
        res.render('pay',{orderName: post.submit});
    }else{
        res.render("partials/additem");
    }

});


app.get("/cafe", (req,res)=>{
    res.render("cafe", {items: List});
});

app.post("/cafe", (req,res)=>{
    if(post.submit){
        res.render('pay',{orderName: post.submit});
    }else{
        res.render("partials/additem");
    }

});



const itemSchema = new mongoose.Schema({
    itemName: String,
    price: Number,
    description: String 
});

const Item = mongoose.model("item", itemSchema);

app.post("/additem", (req,res)=>{
    let newItem = new Item({
        itemName: req.body.itemName,
        price: req.body.price,
        description: req.body.description
    });

    newItem.save();
    console.log(newItem);
    List.push(newItem);
    res.redirect("/raj");
})




app.get("/pay", (req,res)=>{
    res.render("pay");
});

// "http://localhost:4000/pay?name=daadfDSFA&address=FSFA&email=FSAFSAG"
app.post("/pay", (req,res)=>{
    const name = req.body.name;
    const address = req.body.address;
    const email = req.body.email;
    sendVerifyMail2(name, email, address, 'maggi', 50 );
    res.render("index");
});

app.listen(port, () => {
    console.log(`port listing on ${port}`);
});
