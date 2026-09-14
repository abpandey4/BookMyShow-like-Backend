import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15*60*1000,     //15 minutes
    max: 100,                 //100 req per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    }
});

export { apiLimiter };