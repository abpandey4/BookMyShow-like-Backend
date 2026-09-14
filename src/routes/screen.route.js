import { Router } from "express";
import { 
    getAllScreens,
    screenById,
 } from "../controllers/screen.controller.js";


const router = Router()

router.get("/", getAllScreens);
router.get("/:screenId", screenById);

export default router;