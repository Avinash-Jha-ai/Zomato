import cardModel from "../models/card.model.js";
import productModel from "../models/product.model.js";

export const addToCard = async (req, res) => {
    const { product: productId } = req.params;
    const userId = req.user._id;

    try {
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(400).json({
                message: "Product not found",
                success: false
            });
        }

        if (!product.available) {
            return res.status(400).json({
                message: "Product is not available",
                success: false
            });
        }

        let cardItem = await cardModel.findOne({
            user: userId,
            product: productId
        });

        if (cardItem) {
            cardItem.quantity += 1;
            await cardItem.save();
        } else {
            cardItem = await cardModel.create({
                user: userId,
                product: productId,
                quantity: 1
            });
        }

        return res.status(200).json({
            message: "Product added to cart",
            success: true,
            cardItem
        });
    } catch (error) {
        console.log("Error in add to card: ", error);
        return res.status(500).json({
            message: "Error in add to card",
            success: false,
            error: error.message
        });
    }
};

export const getCard = async (req, res) => {
    const userId = req.user._id;

    try {
       const cardItems = await cardModel
            .find({ user: userId })
            .populate("product");

        return res.status(200).json({
            success: true,
            cardItems
        });

    } catch (error) {
        console.log("Error in get card:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message
        });
    }
};

export const deleteProductFromCard = async (req, res) => {
    const { product: productId } = req.params;
    const userId = req.user._id;

    try {
       const item = await cardModel.findOneAndDelete({
            user: userId,
            product: productId
        });

        if (!item) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product removed from cart",
            success: true
        });

    } catch (error) {
        console.log("Error in delete card item:", error);
        return res.status(500).json({
            message: "Error deleting product",
            success: false,
            error: error.message
        });
    }
};

export const clearCard = async (req, res) => {
    const userId = req.user._id;

    try {
       await cardModel.deleteMany({ user: userId });

        return res.status(200).json({
            message: "Cart cleared",
            success: true
        });

    } catch (error) {
        console.log("Error in clear card:", error);
        return res.status(500).json({
            message: "Error clearing cart",
            success: false,
            error: error.message
        });
    }
};