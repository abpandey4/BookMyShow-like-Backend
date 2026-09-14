// Configure Express
// app.js prepares the application and index.js starts the application

import express from "express";      // express helps to create BE server and API
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.route.js";
import movieRouter from "./routes/movie.route.js";
import theatreRouter from "./routes/theatre.route.js";
import screenRouter from "./routes/screen.route.js";
import seatRouter from "./routes/seat.route.js";
import showRouter from "./routes/show.route.js";
import bookingRouter from "./routes/booking.route.js";
import paymentRouter from "./routes/payment.route.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import helmet from "helmet";



const app = express();                  // create an Express application object

app.use(helmet());                      // it helps secure application by setting up http security headers 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));                // it allows express to understand JSON req Bodies  express.json parses it soo we can access req.body
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());
app.use(apiLimiter);                                      // ratelimiter

app.get("/", (req,res)=>{
    res.status(200).json({
        success: true,
        message: "BookMyShow Backend API is running"
    })
})

app.use("/api/v1", router);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/theatres", theatreRouter);
app.use("/api/v1/screens", screenRouter);
app.use("/api/v1/seats", seatRouter);
app.use("/api/v1/shows", showRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);

app.use(errorHandler);

export default app;

