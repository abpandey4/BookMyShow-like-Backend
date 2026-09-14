import { Router } from "express";
import { 
    getAllMovies,
    getMovieById,
    filterMovies,
    semanticSearchMovies
 }  from "../controllers/movie.controller.js";

const router = Router();

router.get("/", getAllMovies);
router.get("/filter", filterMovies);
router.get("/search", semanticSearchMovies);
router.get("/:movieId", getMovieById);

export default router;