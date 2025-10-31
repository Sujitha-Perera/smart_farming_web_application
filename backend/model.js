import mongoose, { Schema } from "mongoose";

const userSchema=new Schema({
    name:String,
    email:String,
    password:String,
    rpassword:String
});

const User=mongoose.model('userstable',userSchema);

export default User;