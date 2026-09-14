import { Router } from "express";

import {
    createScreen,
    updateScreen,
    deleteScreen
} from "../controllers/screen.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post(
    "/",
    verifyJWT,
    isAdmin, 
    createScreen
);

router.patch(
    "/:screenId",
    verifyJWT,
    isAdmin, 
    updateScreen
);

router.delete(
    "/:screenId",
    verifyJWT,
    isAdmin, 
    deleteScreen
);

export default router;