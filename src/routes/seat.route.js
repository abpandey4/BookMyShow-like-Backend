import { Router } from "express";
import { 
    getSeatById,
    getAllSeats,
 } from "../controllers/seat.controller.js";

const router = Router();

router.get("/", getAllSeats);
router.get("/:seatId", getSeatById);

export default router;