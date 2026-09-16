import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Show } from "../models/show.model.js";
import { Seat } from "../models/seat.model.js";
import { ShowSeat } from "../models/showSeat.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendNotification } from "../services/notification.service.js";
import { lockSeat, releaseSeat } from "../services/seatLock.service.js";

const createBooking = asyncHandler(async(req,res)=>{

    const session = await mongoose.startSession();

    const lockedSeats = [];
    
    try {

        session.startTransaction();
        const { show, seats } = req.body;
    
        const userId = req.user._id;

        // 1.validate request body

        if(!show || !seats || seats.length === 0){
            throw new apiError(400, "Shows and Seats are required");
        }
    
        //2. remove duplicate seats

        const uniqueSeats = [...new Set(seats.map(seat => seat.toString()))];
    
        if(uniqueSeats.length !== seats.length){
            throw new apiError(400, "Duplicate seats are not allowed");
        }
    
        //3. find the show

        const showExists = await Show
            .findById(show)
            .session(session);

        if(!showExists){
            throw new apiError(404, "Show Not Found");
        }
    
        // 4. find requested seats

        const seatsExist = await Seat.find({
            _id: { $in: uniqueSeats }
        }).session(session);
    
        if(seatsExist.length !== uniqueSeats.length){
            throw new apiError(404, "One or more seats not found");
        }

        // 5. validate seats belong to the show's screen
    
        for(const seat of seatsExist){

            if(seat.screen.toString() !== showExists.screen.toString()){
                throw new apiError(400, `Seat ${seat.seatNumber} does'nt belongs to this show's screen`)
            }
            if(!seat.isActive){
                throw new apiError(400, `Seat ${seat.seatNumber} is not active`);
            }
        }

        //6. Reserve each showSeat automatically 
    
        for(const seatId of uniqueSeats){

            //check showseat is actually available

            const showSeat = await ShowSeat.findOne({
                show: show,
                seat: seatId,
                status: "AVAILABLE"
            }).session(session);

            if(!showSeat){

                //Release seats that we already locked

                for(const lockedSeatId of lockedSeats){
                    await releaseSeat(show, lockedSeatId);
                }

                const seat = seatsExist.find(
                    item => item._id.toString() === seatId.toString()
                );

                throw new apiError(409, `Seat ${seat?.seatNumber || seatId} is already booked or unavialable`);
            }

            // try to acquire Redis lock

            const locked = await lockSeat(
                show,
                seatId,
                userId.toString(),
                300
            );

            if(!locked){

                // release previously locked seats

                for(const lockedSeatId of lockedSeats){
                    await releaseSeat(show, lockedSeatId);
                }

                const seat = seatsExist.find(
                    item => item._id.toString() === seatId.toString()
                );

                throw new apiError(409, `Seat ${seat?.seatNumber || seatId} is currently locked by another user`);
            }

            lockedSeats.push(seatId);
 
        }
    
        //7. calculate total amount

        const totalAmount = showExists.price * uniqueSeats.length;

        //8. create booking inside transaction
    
        const booking = await Booking.create(
            [
                {
                    user: userId,
                    show,
                    seats: uniqueSeats,
                    totalAmount,
                    status: "PENDING",
                    paymentStatus: "PENDING"
                }
            ],
            {session}
        );
    
        await session.commitTransaction();                                                  //9. commit transaction

        session.endSession();                                                               //10. Close session

        // 11. fetch complete booking information

        const createdBooking = await Booking
            .findById(booking[0]._id)
            .populate("user", "-password -refreshToken")
            .populate({
                path: "show",
                populate: [
                    {
                        path: "movie"
                    },
                    {
                        path: "screen"
                    }   
                ]
            }).populate("seats");

            await sendNotification({
                to: createdBooking.user.email,
                subject: "Booking created - Payment Pending",
                message: `Your booking has been successfully created
                Please complete the payment to confirm booking.`
            });
    
        return res
            .status(201)
            .json(new apiResponse(201, createdBooking, "Booking created Successfully")); 
    }
    catch (error) {

        if(session.inTransaction()){
            await session.abortTransaction();
        }

        // Release Redis Locks if booking creation failed

        for(const seatId of lockedSeats){
            await releaseSeat(Show, seatId);
        }

        throw error;
    }
    finally{
        await session.endSession();
    }
});

const getBookingById = asyncHandler(async(req,res)=>{
    const { bookingId } = req.params;

   // console.log("BOOKING ID FROM URL:", bookingId);

    const booking = await Booking
        .findById(bookingId)
        .populate("user", "-password -refreshToken")
        .populate({
            path: "show",
            populate: [
                {
                    path: "movie"
                },
                {
                    path: "screen"
                }
            ]
        }).populate("seats")
       // console.log("BOOKING FOUND:", booking);

        if(!booking){
            throw new apiError(404, "Booking not found");
        }

    return res
        .status(200)
        .json(new apiResponse(200, booking, "Booking fetched Successfully"));
});

const getMyBookings = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    const bookings = await Booking
        .find({user : userId})
        .populate({
            path: "show",
            populate:[
                {
                    path: "movie"
                },
                {
                    path: "screen"
                }
            ]
        })
        .populate("seats")
        .sort({createdAt: -1});
    
    if(!bookings || bookings.length === 0){
        throw new apiError(404, "No Bookings Found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, bookings, "Bookings Fetched successfully"));
});

const cancelBooking = asyncHandler(async(req,res)=>{

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const{ bookingId } = req.params;
    
        const userId = req.user._id;
    
        //1.find the booking
    
        const booking = await Booking
            .findById(bookingId)
            .populate("user", "-password -refreshToken")
            .session(session)
    
        if(!booking){
            throw new apiError(404, "Booking not found");
        }
    
        // 2. check booking ownership
     
        if(booking.user._id.toString() !== userId.toString()){
            throw new apiError(403, "you are not authorized to cancel the booking ")
        }
    
        //3. check current booking status
    
        if(booking.status === "CANCELLED"){
            throw new apiError(400, "Booking is already cancelled");
        }
    
        //4. cancel the booking
    
        booking.status = "CANCELLED";
    
        //5. update payment status
    
        if(booking.paymentStatus === "PAID"){
            booking.paymentStatus = "REFUND_PENDING";
        }

        await booking.save({ session });

        //6. release ShowSeats


        const releasedSeats = await ShowSeat.updateMany(
            {
                show: booking.show,
                seat:{ $in: booking.seats}
            },
            {
                $set: {
                    status: "AVAILABLE",
                    lockedAt: null
                }
            },
            {
                session
            }
        );

        if(releasedSeats.matchedCount !== booking.seats.length){
            throw new apiError(404, "one or more showseats were not found");
        }

        //7 commit transaction

        await session.commitTransaction();

        try {
            const user = await mongoose.model("User").findById(userId);

            await sendNotification({
                to: booking.user.email,
                subject: "Booking Cancelled",
                message: `Your Booking has be cancelled successfully.
                Booking ID: ${booking._id}
                Your seats have been released and are now available for booking
                ${booking.paymentStatus === "REFUND_PENDING"? "Your refund has been marked as REFUND_PENDING":""}`
            });

            console.log("Booking cancellation email sent successfully");
            
        } catch (error) {
            console.error("Failed to send cancellation email:", error);
        }
        
        //7.populate cancelled booking
    
        await booking.populate([
            {
                path: "show",
                populate: [
                    {
                        path: "movie"
                    },
                    {
                        path: "screen"
                    }
                ]
            },
            {
                path: "seats"
            }
        ]);
    
        return res
            .status(200)
            .json(new apiResponse(200, booking, "Booking cancelled successfully"));


    } catch (error) {

        if(session.inTransaction()){
            await session.abortTransaction();
        }

        throw error;
        
    } finally{
        await session.endSession();
    }
});

export { 
    createBooking, 
    getBookingById,
    getMyBookings,
    cancelBooking
};