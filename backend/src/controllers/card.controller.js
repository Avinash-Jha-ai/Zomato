import cardModel from "../models/card.model.js";
import productModel from "../models/product.model.js";


export const addToCard =async (req,res)=>{
    const {productId} =req.params
    const userId =req.user._id;

    try{

        const product =await productModel.findById(productId);

        if(!product){
            return res.status(400).json({
                message:"product not found",
                success:false
            })
        }

        if(!product.available){
            return res.status(400).json({
                message:"product is not available",
                success:false
            })
        }

        let cartItem = await cartModel.findOne({
            user: userId,
            product: productId
        });

        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            cartItem = await cartModel.create({
                user: userId,
                product: productId,
                quantity: 1
            });
        }


        return res.status(200).json({
            message: "product added to cart",
            success: true,
            cartItem
        });
    }catch(error){
        console.log("error in add to card : ",error);
        return res.status(500).json({
            message:"error in add to card",
            success:false,
            error:error.message
        })
    }
}

export const getCard = async (req, res) => {
  const userId = req.user._id;

  try {
    const cartItems = await cartModel
      .find({ user: userId })
      .populate("product");

    return res.status(200).json({
      success: true,
      cartItems
    });

  } catch (error) {
    console.log("error in get cart:", error);
    return res.status(500).json({
      success: false,
      message: "error fetching cart",
      error: error.message
    });
  }
};

export const deleteProductFromCard = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const item = await cartModel.findOneAndDelete({
      user: userId,
      product: productId
    });

    if (!item) {
      return res.status(404).json({
        message: "item not found in cart",
        success: false
      });
    }

    return res.status(200).json({
      message: "product removed from cart",
      success: true
    });

  } catch (error) {
    console.log("error in delete cart item:", error);
    return res.status(500).json({
      message: "error deleting product",
      success: false,
      error: error.message
    });
  }
};

export const clearCard = async (req, res) => {
  const userId = req.user._id;

  try {
    await cartModel.deleteMany({ user: userId });

    return res.status(200).json({
      message: "cart cleared",
      success: true
    });

  } catch (error) {
    console.log("error in clear cart:", error);
    return res.status(500).json({
      message: "error clearing cart",
      success: false,
      error: error.message
    });
  }
};