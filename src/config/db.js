import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);  
    } catch (error) {
        console.log("MongoDb connection Error:", error);
        process.exit(1);
        
    }
}

export default connectDB;