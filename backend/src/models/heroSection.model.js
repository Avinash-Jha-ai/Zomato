import mongoose from "mongoose";

const heroSectionSchema =new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    }
})

const heroSectionModel =mongoose.model("hero",heroSectionSchema);

export default heroSectionModel