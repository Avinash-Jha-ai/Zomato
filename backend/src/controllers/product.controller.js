import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import {uploadFile ,deleteFile} from "../services/storage.service.js"

export const uploadProduct =async (req,res)=>{
    const userId =req.user._id;
    const {title,description,price,available}=req.body;

    try{
        if(!title || !description || !price){
            return res.status(400).json({
                message:"enter proper detail",
                success:false
            })
        }

        const images = req.files
        ? await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadFile(file, `zomato/${userId}/product`);
                return {
                url: result.url,
                public_id: result.public_id
                };
            })
            )
        : [];

        const product =await productModel.create({
            user:userId,
            title,
            description,
            price,
            available: available !== undefined ? available : true,
            images
        })

        return res.status(200).json({
            message:"product uploaded successfully",
            success:true,
            product
        })
    }catch(error){
        console.log("error in upload product : ",error);
        return res.status(500).json({
            message:"error in upload product",
            success:false,
            error:error
        })
    }
}

export const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.aggregate([
      { $sample: { size: 50 } }
    ]);

    return res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
        console.log("error in get all products:", error);
        return res.status(500).json({
        success: false,
        message: "error fetching products",
        error: error.message
        });
    }
};

export const getProduct =async (req,res)=>{
    const {productId} =req.params;

    try{
        const product =await productModel.findById(productId);

        if(!product){
            return res.status(400).json({
                message:"product not found",
                success:false
            })
        }

        return res.status(200).json({
            message:"product fetch successfully",
            success:true,
            product
        })
    }catch (error) {
        console.log("error in get products:", error);
        return res.status(500).json({
        success: false,
        message: "error fetching product",
        error: error.message
        });
    }
}

export const deleteProduct =async (req,res)=>{
    const {productId}=req.params;

    try{

        const product =await productModel.findById(productId);

        if(!product){
            return res.status(400).json({
                message:"product not found",
                success:false
            })
        }

        await Promise.all(
            product.images.map(async (img) => {
                await deleteFile(img.public_id);
            })
        );

        await productModel.findByIdAndDelete(productId);

        return res.status(200).json({
            message:"product deleted",
            success:true
        })
    }catch(error){
        console.log("error in delete product : ",error);
        return res.status(500).json({
            message:"error in delete product ",
            success:false,
            error:error.message
        })
    }
}

export const getVeg = async (req, res) => {
  try {
    const products = await productModel.find({ veg: true });

    return res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    console.log("error in get veg:", error);
    return res.status(500).json({
      success: false,
      message: "error fetching veg products",
      error: error.message
    });
  }
};

export const getNonVeg = async (req, res) => {
  try {
    const products = await productModel.find({ veg: false });

    return res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    console.log("error in get non-veg:", error);
    return res.status(500).json({
      success: false,
      message: "error fetching non-veg products",
      error: error.message
    });
  }
};