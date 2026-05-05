import { Router } from "express";
import {isAdmin ,authenticateUser} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {getHeroSection ,uploadHeroContent,deleteHeroSection} from "../controllers/heroSection.controller.js";

const router =Router();

router.post("/upload", authenticateUser, isAdmin, upload.single("hero"), uploadHeroContent);

router.get("/",getHeroSection);

router.delete("/delete/:hero", authenticateUser, isAdmin, deleteHeroSection);

export default router