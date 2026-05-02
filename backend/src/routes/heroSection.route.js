import { Router } from "express";
import {authenticateAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {getHeroSection ,uploadHeroContent,deleteHeroSection} from "../controllers/heroSection.controller.js";

const router =Router();

router.post("/upload",upload.single("hero"),authenticateAdmin,uploadHeroContent);

router.get("/",authenticateUser,getHeroSection);

router.get("/delete/:hero",authenticateAdmin,deleteHeroSection);

export default router