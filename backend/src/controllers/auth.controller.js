import userModel from "../models/user.model.js";
import { uploadFile } from "../services/storage.service.js";
import jwt from "jsonwebtoken"
import {config} from "../configs/config.js"

export const register =async (req,res) => {
    const {username , email ,password} =req.body;

    try{

        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "All fields are required", 
                success: false 
            });
        }

        const isAlreadyUser =await userModel.findOne({email});
        if(isAlreadyUser){
            return res.status(400).json({
                message:"user already exist",
                success:false
            })
        }

        const user = await userModel.create({
            username,
            email,
            password,
        });

        const token =jwt.sign({
            id:user._id
        },config.JWT_SECRET,{
            expiresIn:"1d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
              
            }
        });


    }catch(error){
        console.log("error in register : ",error);
        return res.status(500).json({
            message:"error in register ",
            success:false,
            error:error
        })
    }
}

export const adminRegister =async (req,res) => {
    const {username , email ,password} =req.body;

    try{

        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "All fields are required", 
                success: false 
            });
        }

        const isAlreadyUser =await userModel.findOne({email});
        if(isAlreadyUser){
            return res.status(400).json({
                message:"user already exist",
                success:false
            })
        }

        const user = await userModel.create({
            username,
            email,
            password,
            role:"admin"
        });

        const token =jwt.sign({
            id:user._id
        },config.JWT_SECRET,{
            expiresIn:"1d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
              
            }
        });


    }catch(error){
        console.log("error in register : ",error);
        return res.status(500).json({
            message:"error in register ",
            success:false,
            error:error
        })
    }
}


export const login =async (req,res)=>{
    const {email,password}=req.body;

    try{

        if (!email || !password) {
            return res.status(400).json({ 
                message: "All fields are required", 
                success: false 
            });
        }

        console.log("[Auth] Attempting login for:", email);
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            console.log("[Auth] User not found:", email);
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        console.log("[Auth] User found, comparing password...");
        const match = await user.comparePassword(password);
        if (!match) {
            console.log("[Auth] Password mismatch for:", email);
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        console.log("[Auth] Password match, generating token...");
        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: "1d"
        });

        console.log("[Auth] Token generated, setting cookie...");
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        console.log("[Auth] Login successful for:", email);
        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });





    } catch (error) {
        console.error("Critical Login Error:", error);
        return res.status(500).json({
            message: "Internal server error during login",
            success: false,
            error: error.message
        });
    }
}

export const getMe =async (req,res)=>{
    const userId =req.user.id

    try{

        const user =await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message:"data fetch successfully",
            success:true,
            user:{
                id:user._id,
                email:user.email,
                username:user.username,
            
                role:user.role
            }
        })

    }catch(error){
        console.log("error in get user data : ",error);
        return res.status(500).json({
            message:"error in getMe",
            success:false,
            error:error
        })
    }
}

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

