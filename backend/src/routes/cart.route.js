import { Router } from "express";
import {authenticateAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { getCart,addToCart,deleteProductFromCart,clearCart } from "../controllers/cart.controller.js";
const router=Router();

router.get("/add/:product",authenticateUser,addToCart);

router.get("/",authenticateUser,getCart);

router.get("/delete/:product",authenticateUser,deleteProductFromCart);

router.get("/clear",authenticateUser,clearCart);


export default router
