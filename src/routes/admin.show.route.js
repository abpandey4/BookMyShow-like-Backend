import { Router } from "express";
import {
    createShow,
    updateShow,
    deleteShow
} from "../controllers/show.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post(
    "/",
    verifyJWT,
    isAdmin, 
    createShow
);

router.patch(
    "/:showId",
    verifyJWT,
    isAdmin, 
    updateShow
);

router.delete(
    "/:showId",
    verifyJWT,
    isAdmin, 
    deleteShow
);

export default router;
