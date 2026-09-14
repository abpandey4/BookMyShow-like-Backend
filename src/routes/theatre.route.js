import { Router } from "express";
import { 
    getAllTheatre, 
    getTheatreById,
 } from "../controllers/theatre.controller.js";

const router = Router();

router.get("/", getAllTheatre);
router.get("/:theatreId", getTheatreById);

export default router;
