import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { User } from "../models/user.model.js";

dotenv.config();

const createAdmin = async()=>{
    try {
        await connectDB();

        const existingAdmin = await User.findOne({
            role: "ADMIN"
        });

        if(existingAdmin){
            console.log("Admin user already exists");
            process.exit(0);
        }

        const admin = await User.create({
            username: "admin",
            email: "admin@bookmyshow.com",
            fullname: "BookMyShow Admin",
            password: "Admin@12345",
            role: "ADMIN"
        });

        console.log("Admin user created Successfully");
        console.log({
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role
        });
        process.exit(0);
        
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();