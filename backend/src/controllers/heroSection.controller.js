import heroSectionModel from "../models/heroSection.model.js";
import userModel from "../models/user.model.js";
import {uploadFile ,deleteFile} from "../services/storage.service.js"

export const uploadHeroContent =async (req,res)=>{
    const {title,description} =req.body;
    const userId =req.user._id;
    const file =req.file;

    try{

        const user =await userModel.findById(userId);

        if(!title || !description){
            return res.status(400).json({
                message:"add title and description",
                success:false
            })
        }

        if(!user){
            return res.status(400).json({
                message:"user not found",
                success:false
            })
        }

        if(!file){
            return res.status(400).json({
                message:"upload file",
                success:false
            })
        }

        const result =await uploadFile(file,`zomato/${userId}/hero/`);

        const hero =await heroSectionModel.create({
            title,
            user:userId,
            description,
            content:result.secure_url,
            public_id:result.public_id,
        })

        return res.status(200).json({
            message:"hero content upload successfully",
            success:true,
            hero :{
                id:hero._id,
                title:hero.title,
                description:hero.description,
                content:hero.content,
            }
        })

    }catch(error){
        console.log("error in upload hero section : ",error);
        return res.status(500).json({
            message:"error in upload hero section",
            success:false,
            error :error.message
        })
    }
}

export const getHeroSection =async (req,res)=>{
    
    try{

        const hero =await heroSectionModel.find();

        if(!hero){
            return res.status(400).json({
                message:"hero section not found",
                success:false
            })
        }

        return res.status(200).json({
            message:"hero section fetch ",
            success:true,
            hero
        })


    }catch(error){
        console.log("error in get hero section : ",error);
        return res.status(500).json({
            message:"error in get hero section ",
            success:false,
            error:error.message
        })
    }
}

export const deleteHeroSection =async (req,res)=>{

    const {heroId} =req.params;

    try{

        const hero =await heroSectionModel.findById(heroId);

        await deleteFile(hero.public_id);

        await heroSectionModel.findByIdAndDelete(heroId);

        return res.status(200).json({
            message:"hero deleted",
            success:true
        })


    }catch(error ){
        console.log("error in delete hero section : ",error);
        return res.status(500).json({
            message:"errro in delete hero section",
            success:false,
            error:error.message
        })
    }
}