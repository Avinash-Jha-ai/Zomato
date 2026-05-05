import { Router } from "express";
import {isAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {getHeroSection ,uploadHeroContent,deleteHeroSection} from "../controllers/heroSection.controller.js";

const router =Router();

router.post("/upload",upload.single("hero"),isAdmin,uploadHeroContent);

router.get("/",getHeroSection);

router.get("/delete/:hero",isAdmin,deleteHeroSection);

export default router