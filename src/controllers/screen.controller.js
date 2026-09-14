import { Theatre } from "../models/theatre.model.js";
import { Screen } from "../models/screen.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";    

const createScreen = asyncHandler(async(req, res)=>{
    const {
        theatre,
        name,
        screenType,
        totalSeats,
        facilities
    } = req.body

    if(!theatre || !name || !totalSeats){
        throw new apiError(400, "Required Screen details are missing")
    }

    const theatreExist = await Theatre.findById(theatre);

    if(!theatreExist){
        throw new apiError(404, "Theatre Not Found")
    }

    const screen = await Screen.create({
        theatre,
        name,
        screenType,
        totalSeats,
        facilities
    })
    if(!screen){
        throw new apiError(500, "Screen could not be created")
    }

    return res
        .status(200)
        .json(new apiResponse(200, screen, "Screen created Successfully"));
});

const screenById = asyncHandler(async(req, res)=>{
    
   // console.log("🔥 getScreenById controller HIT");
    const { screenId } = req.params;
    const screen = await Screen
        .findById(screenId)
        .populate("theatre");
    console.log("SCREEN DATA:", screen);    

    if(!screen){
        throw new apiError(404, "Screen Not Found");
    }

    return res
        .status(200)
        .json(new apiResponse
            (200, screen, "Screen Fetched Successfully"));
});

const getAllScreens = asyncHandler(async(req, res)=>{

    const screens = await Screen
        .find()
        .populate("theatre");

    if(screens.length === 0){
        throw new apiError(404, "Screen Not Found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, screens, "Screens Fetched Successfully"));
}); 

const updateScreen = asyncHandler(async(req, res)=>{

    const { screenId } = req.params;

    const screen = await Screen.findByIdAndUpdate(
        screenId,
        {
            $set: req.body
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("theatre");

    if(!screen){
        throw new apiError(404, "Screen Not Found")
    }
    return res
        .status(200)
        .json(new apiResponse(200, screen, "Screen Updated Successfully"))
});

const deleteScreen = asyncHandler(async(req, res)=>{

    const { screenId } = req.params;
    const screen = await Screen.findByIdAndDelete(screenId);

    if(!screen){
        throw new apiError(404, "Screnn Not Found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, screen, "Screen Deleted Successfully"));
});

export {
    createScreen,
    screenById,
    getAllScreens,
    updateScreen,
    deleteScreen
};
