import { Movie } from "../models/movie.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateEmbedding } from "../services/embedding.service.js";
import { createMovieEmbeddingText } from "../utils/movieText.js";
import { getCache, setCache, deleteCache } from "../services/cache.service.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import { parseMovieArrays } from "../utils/movie.utils.js";
import fs from "fs";

const createMovie = asyncHandler(async(req, res)=>{
    const {
        title,
        description,
        duration,
        releaseDate,  
        rating,
    } = req.body;

    const {                          // this because we have arrays in 
        genre,
        language,
        cast,
        crew
    } = parseMovieArrays(req.body);

    if(!title||!description||!genre||!language||!duration||!releaseDate){
        throw new apiError(400, "Required Movie details are missing");
    }

    const posterLocalPath = req.files?.poster?.[0]?.path;
    const trailerLocalPath = req.files?.trailer?.[0]?.path;

    if(!posterLocalPath || !trailerLocalPath){
        throw new apiError(400, "Movie Poster & Trailer are required");
    }


    // upload poster and trailer

    const posterUpload = await uploadOnCloudinary(posterLocalPath);
    const trailerUpload = await uploadOnCloudinary(trailerLocalPath);

    if(!posterUpload || !posterUpload.secure_url){
        throw new apiError(400, "Poster Upload failed");
    }

    if(!trailerUpload || !trailerUpload.secure_url){
        throw new apiError(400, "Trailer Upload failed");
    }

     if(posterLocalPath){
        fs.unlinkSync(posterLocalPath);
    }

    if(trailerLocalPath){
        fs.unlinkSync(trailerLocalPath);
    }

    //now we need the cloudinary's url

    const posterUrl = posterUpload?.secure_url;
    const trailerUrl = trailerUpload?.secure_url;

    const movieText = createMovieEmbeddingText({
        title, description, genre, language,  cast, crew
    });

    const embedding = await generateEmbedding(movieText);

    const movie = await Movie.create({
        title,
        description,
        genre,
        language,
        duration,
        releaseDate,
        poster : posterUrl,
        trailer : trailerUrl,
        rating,
        cast,
        crew,
        embedding
    });

    await deleteCache("movies:all")

    return res
    .status(201)
    .json(new apiResponse(201, movie, "Movie Created successfully"))
});

const getAllMovies = asyncHandler(async(req,res)=>{

    const cacheKey = "movies:all";
    const cachedMovies = await getCache(cacheKey);

    if(cachedMovies){
        return res
            .status(200)
            .json(new apiResponse(200, cachedMovies, "Movies fetched from cache Successfully"));
    }
    
    const movies = await Movie.find()
        .select("-embedding");
    await setCache(cacheKey, movies, 3600);

    return res
        .status(200)
        .json(new apiResponse(200, movies, "Movies fetched successfully"))

});

const getMovieById = asyncHandler(async(req,res)=>{

    const { movieId } = req.params;
    const movie = await Movie.findById(movieId)
        .select("-embedding");

    if(!movie){
        throw new apiError(404, "Movie Not Found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, movie, "Movie fetched Successfully"))
});

const updateMovie = asyncHandler(async(req,res)=>{
    const { movieId } = req.params;

    const updateData = {...req.body };

    // connvert stringified arrays into actual arrays

    if(updateData.genre){
        updateData.genre = JSON.parse(updateData.genre);
    }

    if(updateData.language){
        updateData.language = JSON.parse(updateData.language);
    }

    if(updateData.cast){
        updateData.cast = JSON.parse(updateData.cast);
    }

    if(updateData.crew){
        updateData.crew = JSON.parse(updateData.crew);
    }

    //get uploaded files

    const posterLocalPath = req.files?.poster?.[0]?.path;
    const trailerLocalPath = req.files?.trailer?.[0]?.path;

    // upload new poster and trailer if provided

    if(posterLocalPath){
        const posterUpload = await uploadOnCloudinary(posterLocalPath);

        if(!posterUpload || !posterUpload.secure_url){
            throw new apiError(400, "Poster Upload Failed");
        }
        updateData.poster = posterUpload.secure_url;
    }

    if(trailerLocalPath){
        const trailerUpload = await uploadOnCloudinary(trailerLocalPath);

        if(!trailerUpload || !trailerUpload.secure_url){
            throw new apiError(400, "Trailer Upload failed");
        }

        updateData.trailer = trailerUpload.secure_url;
    }
    
    const movie = await Movie.findByIdAndUpdate(
        movieId,
        {
            $set: updateData
        },
        {
            new: true,        // returnDocument : "after" use this instead because in newer version new:true may not be supported
            runValidators: true
        }
    );

    if(!movie){
        throw new apiError(404, "Movie Not Found")
    }

    // delete temporary files

    if(posterLocalPath){
        fs.unlinkSync(posterLocalPath);
    }

    if(trailerLocalPath){
        fs.unlinkSync(trailerLocalPath);
    }

    await deleteCache("movies:all");

    return res
        .status(200)
        .json(new apiResponse(
            200,
            movie,
            "Movie updated Successfully"
        ))
});

const deleteMovie = asyncHandler(async(req,res)=>{
    const { movieId } = req.params;
    const movie = await Movie.findByIdAndDelete(movieId);

    if(!movie){
        throw new apiError(404, "Movie not Found")
    }

    await deleteCache("movies:all");

    return res
        .status(200)
        .json(new apiResponse(200, movie, "Movie Deleted Successfully"))
});

const filterMovies = asyncHandler(async(req,res)=>{

    const{ genre, language, rating} = req.query;
    const filter = {};

    if(genre){
        filter.genre = genre;
    }
    if(language){
        filter.language = language;
    }
    if(rating){
        filter.rating = {$gte: Number(rating)};
    }

    const movies = await Movie.find(filter)
        .select("-embedding");

    if(movies.length === 0){
        throw new apiError(404, "No Movies Found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, movies, "Movies Filtered Successfully"))
});

const semanticSearchMovies = asyncHandler(async(req,res)=>{
    const { 
        query, 
        genre, 
        language,
        page = 1,
        limit = 10 
    } = req.query;

    if(!query || query.trim() === ""){
        throw new apiError(400, "Search query is required");
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if(!Number.isInteger(pageNumber) || pageNumber < 1){
        throw new apiError(400, "Page must be a positive Integer");
    }

    if(!Number.isInteger(limitNumber)|| limitNumber<1 || limitNumber > 50 ){
        throw new apiError(400, "Limit must be between 1 to 50");
    }

    const skip = (pageNumber-1) * limitNumber;

    const searchQuery = query.trim();      // if user use query=  "    Superhero movies  "...soo it should trim and give o/p

    const filter = {};

    if(genre){
        filter.genre = genre;
    }

    if(language){
        filter.language = language;
    }

    const queryEmbedding = await generateEmbedding(searchQuery);

    const movies = await Movie.aggregate([
        {
            $vectorSearch:{
                index: "movie_vector_index",
                path: "embedding",
                queryVector: queryEmbedding ,
                numCandidates: 100,
                limit: skip + limitNumber,
                filter
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        },
        {
            $project: {
                title: 1,
                description: 1,
                genre: 1,
                language: 1,
                poster: 1,
                score:{
                    $meta: "vectorSearchScore"
                }
            }
        }
    ]);

    return res
        .status(200)
        .json(new apiResponse(
            200, 
            {
                movies,                      // adding pagination metadata for front end 
                pagination:{
                    page: pageNumber,
                    limit: limitNumber,
                    count: movies.length       // this count doesnt mean total no of matches movies in DB ..this means no of movies returned on this page 
                }
            }, 
            "Movies fetched Successfully"
        ));
});


export {
    createMovie,
    getAllMovies,
    getMovieById, 
    updateMovie,
    deleteMovie,
    filterMovies,
    semanticSearchMovies
 };
