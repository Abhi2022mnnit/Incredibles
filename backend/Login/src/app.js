const express = require("express");
const bodyparser = require("body-parser");
const User = require("./models/register");
const mongoose = require("mongoose");
require('./db/conn');

const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const path = require('path');
app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || 4000;


app.get("/", async (req,res)=>{
    try{
        res.render("index");
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
                reEnterpassword: req.body.reEnterpassword
            });
            const registered = await newUser.save();
            res.send(newUser);
        } else {
            console.alert("Re-Enter password didn't matched");
        }
    }catch(error){
        res.status(400).send(error);
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
        if (myuser.password === req.body.password){
             res.render("index");
             console.log("Successfully login");
        }
    } catch (error) {
        console.log("not func");
        res.status(400).send(error);
    }
});


const List = [];

app.get("/raj", (req,res)=>{
    res.render("raj", {items: List});
});

app.post("/raj", (req,res)=>{
    res.render("partials/additem");
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







app.listen(port, () => {
    console.log(`port listing on ${port}`);
});
