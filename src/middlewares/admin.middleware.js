import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isAdmin = asyncHandler(async(req, res, next)=>{
    if(req.user?.role !== "ADMIN"){
        throw new apiError(403, "Forbidden: Admin access required");
    }
    next();
});

export { isAdmin };