import { Router } from "express";
import {
    register,
    login,
    getMe,
    logout,
    adminRegister,
} from "../controllers/auth.controller.js";
import {upload} from "../middlewares/upload.middleware.js"
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router =Router();

router.post("/register",register);
router.post("/admin/register",adminRegister);
router.post("/login",login);
router.get("/me",authenticateUser,getMe);
router.get("/logout",authenticateUser, logout);


export default router