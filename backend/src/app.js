import express from "express"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import heroRouter from "./routes/heroSection.route.js"
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

export default app;