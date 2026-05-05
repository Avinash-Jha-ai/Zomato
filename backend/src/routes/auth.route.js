import { Router } from "express";
import {
    register,
    login,
    getMe,
    logout,
    adminRegister,
    uploadProfile,
    getProfile,
    updateProfile
} from "../controllers/auth.controller.js";
import {upload} from "../middlewares/upload.middleware.js"
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router =Router();

router.post("/register",register);
router.post("/admin/register",adminRegister);
router.post("/login",login);
router.get("/me",authenticateUser,getMe);
router.get("/logout",authenticateUser, logout);

// Profile routes
router.post("/profile/upload",authenticateUser,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 }
  ]),
  uploadProfile
);

router.get("/profile",authenticateUser,getProfile);

router.post("/profile/update",authenticateUser,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 }
  ]),
  updateProfile
);

export default router