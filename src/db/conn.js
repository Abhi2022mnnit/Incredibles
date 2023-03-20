const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/DEV_JAM", {useNewUrlParser:true}
).then(()=> {console.log("Now connected to MongoDB!")}
).catch((err)=>{console.log(err)});


