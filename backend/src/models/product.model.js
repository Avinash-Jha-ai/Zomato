import mongoose from "mongoose";


const productSchema =new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    available:{
        type:Boolean,
        default:true
    },
    veg:{
        type:Boolean,
        default:true
    },
    images:[
        {
            url: {
                type: String,
                required: true
            },
            public_id:{
                type:String,
                required:true
            }
        }
    ],
},{ timestamps: true })

const productModel =mongoose.model("product",productSchema);

export default productModel