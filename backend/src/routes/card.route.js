import { Router } from "express";
import {authenticateAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { getCard,addToCard,deleteProductFromCart,clearCard } from "../controllers/card.controller.js";
const router=Router();

router.get("/add/:product",authenticateUser,addToCard);

router.get("/",authenticateUser,getCard);

router.get("/delete/:product",authenticateUser,deleteProductFromCard);

router.get("/clear",authenticateUser,clearCard);


export default router
