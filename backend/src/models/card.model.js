import mongoose from "mongoose";

const cardSchema =new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    quantity:{
        type:Number,
        default:1
    }
},{timestamps:true});


const cardModel =mongoose.model("card",cardSchema);

export default cardModel

