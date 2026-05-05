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

const app =express();




app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], 
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
app.use("/api",searchRouter);
app.use("api",orderRouter);


export default app;