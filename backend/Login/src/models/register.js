const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstname: { type:String, required:true },
    lastname: { type:String, required:true },
    regnumber: { type:String, required:true },
    email:  { type:String, required:true },
    Hostelname: { type:String, required:true },
    Roomnumber: { type:String, required:true },
    password: { type:String, required:true },
    reEnterpassword: { type:String, required:true },
});


userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        console.log(`Password: ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`now Password is: ${this.password}`);

        this.reEnterpassword = undefined;
    }
    next();
})

const User = new mongoose.model("User", userSchema);

module.exports = User;