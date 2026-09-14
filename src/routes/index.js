import { Router } from "express";
import userRouter from "./user.route.js";
import adminMovieRouter from "./admin.movie.route.js";
import adminTheatreRouter from "./admin.theatre.route.js";
import adminScreenRouter from "./admin.screen.route.js";
import adminSeatRouter from "./admin.seat.route.js";
import adminShowRouter from "./admin.show.route.js";

const router = Router();             // creates a seprate Express router                     

router.get("/health",(req,res)=>{
    res.status(200).json({
        success: true,
        message: "BookMyShow API is healthy"
    })
});

router.use("/users", userRouter);

router.use("/admin/movies", adminMovieRouter);
router.use("/admin/theatres", adminTheatreRouter);
router.use("/admin/screens", adminScreenRouter);
router.use("/admin/seats", adminSeatRouter);
router.use("/admin/shows", adminShowRouter);

export default router;