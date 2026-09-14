import mongoose from "mongoose";
import { Show } from "../models/show.model.js";
import { Seat } from "../models/seat.model.js";
import { Booking } from "../models/booking.model.js";
import { Screen } from "../models/screen.model.js";
import { Movie } from "../models/movie.model.js";
import { ShowSeat } from "../models/showSeat.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createShow = asyncHandler(async(req, res)=>{

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const {
            movie,
            screen,
            showDate,
            startTime,
            endTime,
            price,
            language,
            format
        } = req.body;

        //1. validate required fields
        
        if(!movie || !screen ||!language||!showDate ||!startTime ||!endTime ||price ===undefined){
            throw new apiError(400, "Required show details are missing");
        }

        //2. check movie

        const movieExists = await Movie
            .findById(movie)
            .session(session);

        if(!movieExists){
            throw new apiError(404, "Movie not found");
        }

        //3.check screen
        
        const screenExists = await Screen
            .findById(screen)
            .session(session);
        
        if(!screenExists){  
            throw new apiError(404, "Scrren not found")
        }

        //4. create show
        
        const createdShow = new Show({
            movie,
            screen,
            showDate,
            startTime,
            endTime,
            language,
            price,
            format
        });
        await createdShow.save({ session });
        
        if(!createdShow){
            throw new apiError(500, "Show could Not Created");
        }
        
        // get all seats belonging to this screen
        
        const seats = await Seat.find({
            screen: screen
        }).session(session)
        
        if(seats.length === 0){
            throw new apiError(404, "No seats found for this screen");
        }
        
        // create showSeat records/documets
        
        const showSeats = seats.map((seat)=>({
            show: createdShow._id,
            seat: seat._id,
            status: "AVAILABLE"
        }));
        
        await ShowSeat.insertMany(
            showSeats,
            {session}
        );
        
        //8. commit transaction

        await session.commitTransaction();

        //populate createdShow

        await createdShow.populate([
            {
                path: "movie"
            },
            {
                path: "screen"
            }
        ]);

        await session.endSession();

        return res
            .status(201)
            .json(new apiResponse(201, createdShow, "Show created Successfully"));
            
    } catch (error) {

        await session.abortTransaction();
        session.endSession();
        throw error;   
    }
});

const getShowById = asyncHandler(async(req, res)=>{
    const { showId } = req.params;
    const show = await Show
        .findById(showId)
        .populate("movie")
        .populate("screen");

    if(!show){
        throw new apiError(404, "Show not Found")
    }
    return res
        .status(200)
        .json(new apiResponse(200, show, "Show fetched Successfully"));
});

const getAllShows = asyncHandler(async(req,res)=>{
    const show = await Show
        .find()
        .populate("movie")
        .populate("screen")

    if(!show || show.length === 0){
        throw new apiError(404, "Shows Not Found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, show, "SHow Fetched Successfully"));
});

const updateShow = asyncHandler(async(req, res)=>{
    const{ showId } = req.params;

    const updatedShow = await Show.findByIdAndUpdate(
        showId,
        {
            $set: req.body
        },
        {
            new: true,
            runValidators: true
        }
    )
    .populate("movie")
    .populate("screen")

    if(!updatedShow){
        throw new apiError(404, "Show Not Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, updatedShow, "Show updated Successfully"));
});

const deleteShow = asyncHandler(async(req, res)=>{
    const { showId } = req.params;

    const deletedShow = await Show.findByIdAndDelete(showId)
    if(!deletedShow){
        throw new apiError(400, "Show not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, deletedShow, "Show deleted Successfully"));
});

const getShowSeatAvailable = asyncHandler(async(req,res)=>{
    const { showId } = req.params;

    // find the show

    const show = await Show
        .findById(showId)
        .populate("screen");
    
    if(!show){
        throw new apiError(404, "Show not Found");
    }

    // find all the seats belonging to the show's screen

    const seats = await Seat.find({
        screen: show.screen._id
    });

    if(!seats || seats.length === 0){
        throw new apiError(404, " No seats found for this screen");
    }

    // find booking for the particular show

    const bookings = await Booking.find({
        status: { $ne: "CANCELLED"}                  // ne - not equal
    });

    // get all booked seats ID

    const bookedSeatsIds = bookings.flatMap(
        booking => booking.seats.map(seat => seat.toString())
    );

    // mark every seat as available or booked 

    const seatAvailability = seats.map(seat => ({
        ...seat.toObject(),
        isAvailable: !bookedSeatsIds.includes(seat._id.toString())
    }));

    return res
        .status(200)
        .json(new apiResponse(200, seatAvailability, "Seat Availablity fetched Successfully"));

});

const getShowDetails = asyncHandler(async(req,res)=>{
    const { showId } = req.params;

    const showDetails = await Show.aggregate([

        // stage1: find the requested show

        {
            $match: {
                _id: new mongoose.Types.ObjectId(showId)
            }
        },

        // stage 2: Get movie Information

        {
            $lookup: {
                from: "movies",
                localField: "movie",
                foreignField: "_id",
                as: "movie"
            }
        },

        // stage 3: get screen info

        {
            $lookup: {
                from: "screens",
                localField: "screen",
                foreignField: "_id",
                as: "screen"
            }
        },

        // stage 4: convert movie array into object 

        {
            $unwind: "$movie"
        },

        //stage 5: convert screen array into object

        {
            $unwind: "$screen"
        },

        // stage 6: get theatre infor

        {
            $lookup:{
                from: "theatres",
                localField: "screen.theatre",
                foreignField: "_id",
                as: "theatre"
            }
        },

        // stage 7 : get seats belonging to this screen 

        {
            $lookup:{
                from: "seats",
                localField: "screen._id",
                foreignField: "screen",
                as: "seats"
            }
        },
        
        // get bookings belonging to this show

        {
            $lookup:{
                from: "bookings",
                let: { showId: "$_id"},
                pipeline: [
                    {
                        $match:{
                            $expr:{
                                $and:[                              // $and means all condition must be true
                                    { $eq: ["$show", "$$showId"]},   // $$ means variable created using "let"
                                    { $ne: ["$status", "CANCELLED"]}  // $ means field from the current document
                                ]
                            }
                        }
                    }
                ],
                as: "bookings"
            }
        },

        {
            $addFields:{
                bookedSeatsIds: {
                    $reduce:{
                        input: "$bookings",
                        initialValue: [],
                        in: {
                            $setUnion:[
                                "$$value",
                                "$$this.seats"
                            ]
                        }
                    }
                }
            }
        },

        {
            $addFields:{
                seats: {
                    $map:{
                        input: "$seats",
                        as: "seat",
                        in:{
                            $mergeObjects:[
                                "$$seat",
                                {
                                    isAvailable:{
                                        $not:{
                                            $in:[
                                                "$$seat._id",
                                                "$bookedSeatIds"
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },

        // stage 8: select the fields we want in response

        {
            $project:{
                _id: 1,
                seats: 1,
                showDate: 1,
                startTime: 1,
                endTime: 1,
                price: 1,
                language: 1,
                format: 1,
                isActive: 1,

                movie: 1,
                screen: 1,
                theatre: 1,
                totalSeats: {
                    $size: "$seats"
                },
                bookedSeats: {
                    $size: {
                        $reduce:{
                          input: "$bookings",
                          initialValue: [],
                          in: {
                            $setUnion:[
                                "$$value",
                                "$$this.seats"
                            ]
                          }  
                        }
                    }
                }
            }
        },
        {
        $addFields: {
            availableSeats: {
                $subtract: [
                    "$totalSeats",
                    "$bookedSeats"
                ]
            }
        }
    }
    ]);

    if(!showDetails || showDetails.length === 0){
        throw new apiError(404, "Show not Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, showDetails[0], "Show details fetched successfully"));
});

export { 
    createShow,
    getShowById,
    getAllShows,
    updateShow,
    deleteShow,
    getShowSeatAvailable,
    getShowDetails
};