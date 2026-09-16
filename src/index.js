// here starts the server 
// app.js prepares the application and index.js starts the application

import dotenv from "dotenv";
import dns from"node:dns";
import mongoose from "mongoose";
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
        
        const server = app.listen(PORT, ()=>{
            console.log(`Server is running on PORT ${PORT}`);
        });

        // graceful shutdown

        const gracefulShutdown =async(signal)=>{
            console.log(`${signal} recieved. Shutting down gracefully...`);

            server.close(async ()=>{
                console.log("HTTP server closed");

                await redisClient.quit();
                console.log("Redis Connection closed");

                await mongoose.connection.close();
                console.log("MongoDb connection closed");

                process.exit(0);  
                
            });
            
        };

        process.on("SIGTERM", ()=> gracefulShutdown("SIGTERM"));
        process.on("SIGINT", ()=> gracefulShutdown("SIGINT"));

    })
    .catch((error)=>{
        console.log("MongoDB connection failed:", error);
    });   

