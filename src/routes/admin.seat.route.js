import { Router } from "express";

import{ 
    createSeat,
    updateSeat,
    deleteSeat
} from "../controllers/seat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post(
    "/",
    verifyJWT,
    isAdmin, 
    createSeat
);

router.patch(
    "/:seatId",
    verifyJWT,
    isAdmin, 
    updateSeat
);

router.delete(
    "/:seatId",
    verifyJWT,
    isAdmin, 
    deleteSeat
);

export default router;
