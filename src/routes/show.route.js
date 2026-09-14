import { Router } from "express";
import { 
    getAllShows,
    getShowById,
    getShowSeatAvailable,
    getShowDetails
} from "../controllers/show.controller.js";

const router = Router();

router.get("/", getAllShows);
router.get("/:showId", getShowById);
router.get("/:showId/seats", getShowSeatAvailable);
router.get("/:showId/details", getShowDetails);

export default router;
