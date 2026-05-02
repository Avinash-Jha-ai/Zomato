import express from "express"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js"
import heroRouter from "./routes/heroSection.route.js"
import productRouter from "./routes/product.route.js";
const app =express();



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

export default app;