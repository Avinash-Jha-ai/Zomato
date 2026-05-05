import express from "express"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/auth.route.js"
import heroRouter from "./routes/heroSection.route.js"
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js"
import searchRouter from "./routes/search.route.js"
import orderRouter from "./routes/order.route.js"
import adminRouter from "./routes/admin.route.js"

import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// Security & Optimization
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
}));

const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:5175", 
    "http://localhost:5176",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use("/api/auth",authRouter);
app.use("/api/hero",heroRouter);
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter);
app.use("/api", searchRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : {}
    });
});


export default app;