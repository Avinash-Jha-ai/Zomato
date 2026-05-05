import { Router } from "express";
import {isAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {uploadProduct,getAllProduct,getProduct,deleteProduct,getVeg,getNonVeg,updateProduct} from "../controllers/product.controller.js"

const router =Router();

router.post("/upload",upload.array("images"),isAdmin,uploadProduct);

router.get("/",authenticateUser,getAllProduct);

router.get("/:product",authenticateUser,getProduct);

router.get("/delete/:product",isAdmin,deleteProduct);

router.put("/update/:product",isAdmin,updateProduct);

router.get("/veg",authenticateUser,getVeg);

router.get("/nonVeg",authenticateUser,getNonVeg);

export default router