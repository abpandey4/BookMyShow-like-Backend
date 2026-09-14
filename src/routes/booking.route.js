import { Router } from "express";
import {
    createBooking,
    getBookingById,
    getMyBookings,
    cancelBooking
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createBooking);
router.get("/my-booking", verifyJWT, getMyBookings);
router.get("/:bookingId", verifyJWT, getBookingById);
router.patch("/:bookingId/cancel", verifyJWT, cancelBooking);

export default router;



