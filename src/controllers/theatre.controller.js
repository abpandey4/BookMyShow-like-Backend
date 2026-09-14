import { Theatre } from "../models/theatre.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";  
import { asyncHandler } from "../utils/asyncHandler.js";


const createTheatre = asyncHandler(async(req,res)=>{
    const{
        name,
        location,
        city,
        address,
        screens,
        facilities
    } = req.body;

    if(!name || !location || !city || !address || !screens){
        throw new apiError(400, "Required Theatre details are missing");
    }
    const theatre = await Theatre.create({
        name,
        location,
        city,
        address,
        screens,
        facilities
    });
    if(!theatre){
        throw new apiError(500, "Theatre could not be created")
    }
    return res
        .status(200)
        .json(new apiResponse(201, theatre, "Theatre created successfully"));
});

const getTheatreById = asyncHandler(async(req,res)=>{
    const { theatreId } = req.params;

    const theatre = await Theatre.findById(theatreId);

    if(!theatre){
        throw new apiError(404, "Theatre Not Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, theatre, "Theatre Fetched Successfully"))
});

const getAllTheatre = asyncHandler(async(req,res)=>{
    const theatres = await Theatre.find();

    if(theatres.length === 0){
        throw new apiError(404, "Theatre Not Found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, theatres, "Theatre Fetched Successfully"));
});

const updateTheatre = asyncHandler(async(req,res)=>{
    const { theatreId } = req.params;

    const theatre = await Theatre.findByIdAndUpdate(
        theatreId,{
            $set: req.body                         //tells mongo which fields to update
        },
        {
            new: true,                             // give the new updated value
            runValidators: true                    //apply mongoose schema validation
        }
    );

    if(!theatre){
        throw new apiError(404, "Theatre Not Found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, theatre, "Theatre Updated Successfully"))

});

const deleteTheatre = asyncHandler(async(req,res)=>{

    const { theatreId } = req.params;
    const theatre = await Theatre.findByIdAndDelete(theatreId);

    if(!theatre){
        throw new apiError(404, "Theatre Not Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, theatre, "Theatre deleted Successfully"));

});

export { 
    createTheatre,
    getTheatreById,
    getAllTheatre,
    updateTheatre,
    deleteTheatre
 };
