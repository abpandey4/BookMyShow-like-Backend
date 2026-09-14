// movies before semantic search then they should embedded or migrate byself
// this is one time script ....that's the reason we have written
// await.mongoose.connection.close().....later it will close the connection
//once the embedding is done to the existing movies
// remember this script isn't the express server


import mongoose from "mongoose";
import dotenv from "dotenv";

import { Movie } from "../models/movie.model.js";
import connectDB from "../config/db.js";
import { generateEmbedding } from "../services/embedding.service.js";
import { createMovieEmbeddingText } from "../utils/movietext.js";

dotenv.config();

const generateMovieEmbeddings = async () => {
    try {
        await connectDB();

        const movies = await Movie.find({
            embedding: { $exists: false }
        });

        console.log(`Found ${movies.length} movies without embeddings`);

        for (const movie of movies) {

            const movieText = createMovieEmbeddingText(movie);

            const embedding = await generateEmbedding(movieText);

            movie.embedding = embedding;

            await movie.save();

            console.log(`Embedding generated for: ${movie.title}`);
        }

        console.log("All movie embeddings generated successfully");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Error generating movie embeddings:", error);

        await mongoose.connection.close();
    }
};

generateMovieEmbeddings();