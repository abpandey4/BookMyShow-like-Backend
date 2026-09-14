import  { Router } from "express";
import {
    createTheatre,
    updateTheatre,
    deleteTheatre
} from "../controllers/theatre.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post(
    "/",
    verifyJWT,
    isAdmin,
    createTheatre
);

router.patch(
    "/:theatreId",
    verifyJWT,
    isAdmin,
    updateTheatre
);

router.delete(
    "/:theatreId",
    verifyJWT,
    isAdmin,
    deleteTheatre
);

export default router;