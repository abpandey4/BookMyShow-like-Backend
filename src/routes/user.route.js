import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { 
    registerUser,
    loginUser,
    getCurrentUser, 
    logoutUser,
    refreshAccessToken
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, logoutUser)
router.post("/refresh-token", refreshAccessToken)     // why no verifyjwt...because we want new access token here 

export default router;
