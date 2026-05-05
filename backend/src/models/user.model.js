import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters'],
        select: false  
    },
    banner: {
        type: String,
        required: false
    },
    bannerPublic: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    avatarPublic: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
}, {
    timestamps: true  
});

userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})


userSchema.methods.comparePassword = async function (password) {
    try {
        if (!this.password) return false;
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error("Bcrypt compare error:", error);
        return false;
    }
}

const userModel =mongoose.model("user",userSchema);

export default userModel

