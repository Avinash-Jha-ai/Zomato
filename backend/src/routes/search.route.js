import { Router } from "express";
import {authenticateUser} from "../middlewares/auth.middleware.js";
import {searchProducts} from "../controllers/search.controller.js"
const router =Router();


router.get("/search", searchProducts);


export default router