import express from "express"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js"
import heroRouter from "./routes/heroSection.route.js"
import productRouter from "./routes/product.route.js";
import profileRouter from "./routes/profile.route.js"
import cardRouter from "./routes/card.route.js"
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
app.use("/api/profile",profileRouter);
app.use("/api/card",cardRouter);

export default app;