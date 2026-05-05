import { Router } from "express";
import {isAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {uploadProduct,getAllProduct,getProduct,deleteProduct,getVeg,getNonVeg,updateProduct} from "../controllers/product.controller.js"

const router =Router();

router.post("/upload", authenticateUser, isAdmin, upload.array("images"), uploadProduct);

router.get("/",authenticateUser,getAllProduct);
router.get("/veg",authenticateUser,getVeg);
router.get("/nonVeg",authenticateUser,getNonVeg);

router.get("/:product",authenticateUser,getProduct);
router.delete("/delete/:product", authenticateUser, isAdmin, deleteProduct);
router.put("/update/:product", authenticateUser, isAdmin, updateProduct);

export default router