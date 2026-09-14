import dotenv from "dotenv";
import { generateEmbedding } from "./services/embedding.service.js";

dotenv.config();

const testEmbedding = async()=>{
    const text = "A superhero movie about saving the world";

    const embedding = await generateEmbedding(text);

    console.log("Number of dimensions:", embedding.length);
    console.log("first 10 values:", embedding.slice(0,10));
    
};
testEmbedding();