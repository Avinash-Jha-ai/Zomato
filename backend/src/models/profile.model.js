import mongoose from "mongoose";

const profileSchema =new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    banner:{
        type:String,
        required:true
    },
    bannerPublic:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    avatarPublic:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },


},{timestamps:true});


const profileModel =mongoose.model("profile",profileSchema);


export default profileModel