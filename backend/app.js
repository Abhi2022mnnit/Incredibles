const express = require("express");
const bodyparser = require("body-parser");
const app = express();

app.use(express.static(__dirname + "/public"));
//  app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));

// console.log(__dirname);

app.get("/backend", (req,res)=>{
  res.sendFile(__dirname + "/Devotp.html");
});

app.post("/", (req,res)=> {
  var {mail1, mail2} = req.body;
  console.log(`mail1: ${mail1}`);
  console.log(`mail2: ${mail2}`);
  res.send("data received");

// if(mail1){
//   res.redirect("/backend");
// }

var OTP = Math.floor(Math.random()*9000);

console.log(OTP);

const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "abhisharma6444.as@gmail.com", // generated ethereal user
      pass: 'sgpetxuagcqlvgjo', // generated ethereal password
    },
  });

  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'abhisharma6444.as@gmail.com', // sender address
    to: mail1, // list of receivers
    subject: "One Time Password(OTP)", // Subject line
    text: "Hello world?", // plain text body
    html: `<p>Your <b>OTP</b> for payment request is <b>${OTP}</b>.Valid for <b>Two Minutes</b>.If the transaction is not initiated by you then quickly report to your bank or call toll free number<b>011-2553-2553</b></p>`, // html body
  });  

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


// app.get("/backend")


  //function to validate otp
  // app.post("/backend", (req,res)=> {
  //   var {userotp} = req.body;
  //   console.log(`userotp: ${userotp}`);
    
  //   if(userotp === OTP){
  //     res.send("payment Successfull");
  //   }else{
  //     res.send("Incorrect OTP!!!");
  //   }
  // });


   // send mail to the canteen owner
   let info1 = await transporter.sendMail({
    from: 'abhisharma6444.as@gmail.com', // sender address
    to: mail2, // list of receivers
    subject: "Order Details", // Subject line
    text: "Hello world?", // plain text body
    html: `<p>Order Placed for the item <b>ITEM</b>.</p><p><h3>Customer Details:</h3><li>Name:<b>NAME</b></li><li>Mobile: <b>123456789</b></li><li>Room No.: <b>ROOM_NO</b></li></p><p><h3>Payment Details:</h3><li>TransactionId:<b>info1.message</b></li><li>Amount: <b>₹AMOUNT</b></li></p>`, // html body
  }); 

  console.log("Message sent: %s", info1.messageId);
}

main().catch(console.error);

});

app.listen(port, console.log(`listining on ${port}`))