import { Router } from "express";
import {isAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { getCart,addToCart,deleteProductFromCart,clearCart, updateCartQuantity } from "../controllers/cart.controller.js";
const router=Router();

router.post("/add/:product", authenticateUser, addToCart);
router.get("/", authenticateUser, getCart);
router.put("/update/:product", authenticateUser, updateCartQuantity);
router.delete("/delete/:product", authenticateUser, deleteProductFromCart);
router.delete("/clear", authenticateUser, clearCart);


export default router
