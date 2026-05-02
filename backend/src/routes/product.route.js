import { Router } from "express";
import {authenticateAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {uploadProduct,getAllProduct,getProduct,deleteProduct,getVeg,getNonVeg} from "../controllers/product.controller.js"

const router =Router();

router.post("/upload",upload.array("images"),authenticateAdmin,uploadProduct);

router.get("/",authenticateUser,getAllProduct);

router.get("/:product",authenticateUser,getProduct);

router.get("/delete/:product",authenticateAdmin,deleteProduct);

router.get("/veg",authenticateUser,getVeg);

router.get("/nonVeg",authenticateUser,getNonVeg);

export default router