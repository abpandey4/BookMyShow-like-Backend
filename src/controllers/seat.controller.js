import { Seat } from "../models/seat.model.js";
import { Screen } from "../models/screen.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSeat = asyncHandler(async(req,res)=>{
    const{
        screen, 
        seatNumber,
        row,
        seatType,
        price,
    } = req.body

    if(!screen|| !seatNumber || !row || !price === undefined){
        throw new apiError(400, "Required seat details are missing");
    }

    const screenExists = await Screen.findById(screen)

    if(!screenExists){
        throw new apiError(404, "Screen Not Found");
    }

    const seatExists = await Seat.findOne({
        screen, 
        seatNumber      
    });

    if(seatExists){
        throw new apiError(409, "Seat already exists in this screen");
    }

    const seat = await Seat.create({
        screen, 
        seatNumber,
        row, 
        seatType,
        price   
    });

    if(!seat){
        throw new apiError(500, "Seat could not be created")
    }

    return res
        .status(200)
        .json(new apiResponse(201, seat, "Seat created Successfully"));
});

const getSeatById = asyncHandler(async(req,res)=>{

    const { seatId } = req.params;

    const seat = await Seat.findById(seatId).populate("screen");

    if(!seat){
        throw new apiError(404, "Seat Not Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, seat, "Seat Fetched Successfully"));
});

const getAllSeats = asyncHandler(async(req,res)=>{
    const seats = await Seat.find().populate("screen");

    if(!seats || seats.length === 0){
        throw new apiError(404, "No seats Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, seats, "Seats Fetched Successfully"))
});

const updateSeat = asyncHandler(async(req,res)=>{

    const { seatId } = req.params;

    const updatedSeat = await Seat.findByIdAndUpdate(
        seatId,
        {
            $set: req.body
        },
        {
            new: true,
            runValidators: true
        }
    );

    if(!updatedSeat){
        throw new apiError(404, "Seat Not Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, updatedSeat, "Seat Updated Successfully"));

});

const deleteSeat = asyncHandler(async(req,res)=>{
    const{ seatId } = req.params;
    const deletedSeat = await Seat.findByIdAndDelete(seatId);

    if(!deletedSeat){
        throw new apiError(404, "Seat Not Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, deletedSeat, "Seat Deleted Successfully"))
})


export { 
    createSeat,
    getSeatById,
    getAllSeats,
    updateSeat,
    deleteSeat
};

