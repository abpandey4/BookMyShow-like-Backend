import { Router } from "express";
import {
    createMovie,
    updateMovie,
    deleteMovie
} from "../controllers/movie.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post(
    "/",
    verifyJWT,
    isAdmin,
    upload.fields([
        { name: "poster", maxCount: 1},
        { name: "trailer", maxCount: 1}
    ]),
    createMovie
);

router.patch(
    "/:movieId",
    verifyJWT,
    isAdmin,
    upload.fields([
        { name: "poster", maxCout: 1 },
        { name: "trailer", maxCount: 1}
    ]),
    updateMovie
);

router.delete(
    "/:movieId",
    verifyJWT,
    isAdmin, 
    deleteMovie
);

export default router;
