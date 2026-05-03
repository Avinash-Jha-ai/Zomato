import { Router } from "express";
import {authenticateAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {updateProfile,uploadProfile,getProfile} from "../controllers/profile.controller.js"

const router=Router();


router.post("/upload",authenticateUser,upload.single("image"),uploadProfile);

router.get("/",authenticateUser,getProfile);

router.post("/update",authenticateUser,updateProfile);

export default router