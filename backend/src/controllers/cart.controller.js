import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export const addToCart = async (req, res) => {
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

        const { quantity = 1 } = req.body;
        let cartItem = await cartModel.findOne({
            user: userId,
            product: productId
        });

        if (cartItem) {
            cartItem.quantity += Number(quantity);
            await cartItem.save();
        } else {
            cartItem = await cartModel.create({
                user: userId,
                product: productId,
                quantity: Number(quantity)
            });
        }

        return res.status(200).json({
            message: "Product added to cart",
            success: true,
            cartItem
        });
    } catch (error) {
        console.log("Error in add to cart: ", error);
        return res.status(500).json({
            message: "Error in add to cart",
            success: false,
            error: error.message
        });
    }
};

export const getCart = async (req, res) => {
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
        console.log("Error in get cart:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message
        });
    }
};

export const deleteProductFromCart = async (req, res) => {
    const { product: productId } = req.params;
    const userId = req.user._id;

    try {
       const item = await cartModel.findOneAndDelete({
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
        console.log("Error in delete cart item:", error);
        return res.status(500).json({
            message: "Error deleting product",
            success: false,
            error: error.message
        });
    }
};

export const clearCart = async (req, res) => {
    const userId = req.user._id;

    try {
       await cartModel.deleteMany({ user: userId });

        return res.status(200).json({
            message: "Cart cleared",
            success: true
        });

    } catch (error) {
        console.log("Error in clear cart:", error);
        return res.status(500).json({
            message: "Error clearing cart",
            success: false,
            error: error.message
        });
    }
};

export const updateCartQuantity = async (req, res) => {
    const { product: productId } = req.params;
    const { change } = req.body; // +1 or -1
    const userId = req.user._id;

    try {
        let cartItem = await cartModel.findOne({ user: userId, product: productId });
        if (!cartItem) return res.status(404).json({ message: "Item not found" });

        cartItem.quantity += change;

        if (cartItem.quantity <= 0) {
            await cartModel.findByIdAndDelete(cartItem._id);
            return res.status(200).json({ message: "Item removed", success: true, removed: true });
        }

        await cartItem.save();
        return res.status(200).json({ message: "Quantity updated", success: true, cartItem });
    } catch (error) {
        return res.status(500).json({ message: "Error updating quantity", success: false });
    }
};