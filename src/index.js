// here starts the server 
// app.js prepares the application and index.js starts the application

import dotenv from "dotenv";
import dns from"node:dns";
import app from "./app.js";
import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";
import cloudinary from "./config/cloudinary.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);    // this was google dns ip address
dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 8000;

connectDB()
    .then(async()=>{

        await redisClient.connect();
        console.log("Redis Connected Successfully");
        
        app.listen(PORT, ()=>{
            console.log(`Server is running on PORT ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log("MongoDB connection failed:", error);
    });   

