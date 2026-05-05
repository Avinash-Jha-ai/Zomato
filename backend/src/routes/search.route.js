import { Router } from "express";
import {authenticateUser} from "../middlewares/auth.middleware.js";
import {searchProducts} from "../controllers/search.controller.js"
const router =Router();


router.get("/search",authenticateUser, searchProducts);


export default router