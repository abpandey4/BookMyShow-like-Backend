import mongoose from "mongoose";
import { Payment } from "../models/payment.model.js";
import { Booking } from "../models/booking.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendNotification } from "../services/notification.service.js";
import { ShowSeat } from "../models/showSeat.model.js";
import { getSeatLock, releaseSeat } from "../services/seatLock.service.js";

const createPayment = asyncHandler(async(req, res)=>{
    const { bookingId, paymentMethod } = req.body;

    const userId = req.user._id;

    //1. validate request

    if(!bookingId || !paymentMethod){
        throw new apiError(400, "BookingId and payment Method are required");
    }

    //2 find booking

    const booking = await Booking.findById(bookingId);

    if(!booking){
        throw new apiError(404, "Booking not Found");
    }

    //3 check booking ownership

    if(booking.user.toString() !== userId.toString()){
        throw new apiError(403, "You are not authorized to make payment for this booking");
    }

    //4 check booking status

    if(booking.status !== "PENDING"){
        throw new apiError(400, "Booking is not avaiable for payment");
    }

    //5 check existing payment

    const existingPayment = await Payment.findOne({ booking: bookingId });

    if(existingPayment){
        throw new apiError(400, "Payment already Exists for this booking");
    }

    //6 create payment

    const payment = await Payment.create({
        user: userId,
        booking: bookingId,
        amount: booking.totalAmount,
        paymentMethod,
        paymentStatus: "PENDING"
    });

    return res
        .status(201)
        .json(new apiResponse(201, payment, "Payment created successfully"));
});

const updatePaymentStatus = asyncHandler(async(req,res)=>{
    
    const { paymentId } = req.params;
    const { paymentStatus } = req.body;

    const userId = req.user._id;

    //1. validate payment status

    if(!paymentStatus){
        throw new apiError(400, "Payment status is required");
    }

    if(!["SUCCESS","FAILED"].includes(paymentStatus)){
        throw new apiError(400, "Invalid payment status");
    }

    //2. find payment

    const payment = await Payment.findById(paymentId);

    if(!payment){
        throw new apiError(404, "Payment not found");
    }

    //3. check payment ownership

    if(payment.user.toString() !== userId.toString()){
        throw new apiError(403, "You are not authorised to update this payment");
    }

    const session = await mongoose.startSession();
    try{

        session.startTransaction();

        //4. update payment status

        payment.paymentStatus = paymentStatus;

        //5. generate transaction ID for successful payment

        if(paymentStatus === "SUCCESS"){
            payment.transactionId = `TXN_${Date.now()}`;
        }

        await payment.save({ session });

        //6. find related booking

        const booking = await Booking
            .findById(payment.booking)
            .populate("user", "-password -refreshToken")
            .session(session);

        if(!booking){
            throw new apiError(404, "Related booking not found");
        }

        //7. update booking status based on payment status 

        if(paymentStatus === "SUCCESS"){

            // Check every seat is still locked by this user

            console.log("Checking Redis lock");
            console.log("Show:", booking.show.toString());

            for(const seatId of booking.seats){

                console.log("Seat:", seatId.toString());
                
                const lockOwner = await getSeatLock(
                    booking.show,
                    seatId
                );

                if(lockOwner !== userId.toString()){
                    throw new apiError(409, `Seat ${seatId} lock has expired or belongs to another user` );
                }
            }

            // permanently book the seats

            for(const seatId of booking.seats){
                const showSeat = await ShowSeat.findOneAndUpdate(
                    {
                        show: booking.show,
                        seat: seatId,
                        status: "AVAILABLE"
                    },
                    {
                        $set: {
                            status: "BOOKED"
                        }
                    },
                    {
                        new: true,
                        session
                    }
                );

                if(!showSeat){
                    throw new apiError(409, `Seat ${seatId} is no longer available`);
                }
            }

            //confirm booking 

            booking.status = "CONFIRMED";
            booking.paymentStatus = "PAID";
        } else if(paymentStatus === "FAILED"){
            booking.paymentStatus = "FAILED";
        }

        await booking.save({ session });

        // 8. Commit transaction

        await session.commitTransaction();

        // release Redis locks

        if(paymentStatus === "SUCCESS"){
            for(const seatId of booking.seats){
                await releaseSeat(booking.show, seatId);
            }
        }

         if(paymentStatus === "FAILED"){

            // Release Redis seat locks
            for(const seatId of booking.seats){
                await releaseSeat(booking.show, seatId);
            }
        }


        // send notifications

        if(paymentStatus === "SUCCESS"){
            try {
                await sendNotification({
                    to: booking.user.email,
                    subject: "Payment successfull - Booking Confirmed",
                    message: `Your payment was successfull....
                    Your booking has been confirmed
                    Tansaction ID: ${payment.transactionId}
                    Amount: Rs${payment.amount}`     
                });

                console.log("Booking confirmation email sent successfully")
            } catch (error) {
                    console.error("Failed to send booking confirmation email:", error);

            }
        }

       
        if(paymentStatus === "FAILED"){
            try {
                await sendNotification({
                    to: booking.user.email,
                    subject: "Payment Failed - Booking",
                    message: `Your Payment could'nt complete
                    Your booking payment is failed
                    Amount: Rs${payment.amount}
                    Please try Again with another payment Method.`
                });
                console.log("Paymnet Failure Email sent Successfully");
            } catch (error) {
                console.log("Failed to sent payment failure email:", error);
            }
        }

        //9. Return updated payment

        return res
            .status(200)
            .json(new apiResponse(200, {payment, booking}, "Payment status updated Successfully"));

    } catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        throw error;
    }
    finally{
        await session.endSession();
    }
});

const getPaymentById = asyncHandler(async(req,res)=>{
    const { paymentId } = req.params;

    const userId = req.user._id;

    //1.Find Payment

    const payment = await Payment
        .findById(paymentId)
        .populate({
            path: "booking",
            populate: {
                path: "show",
                populate: [
                    {
                        path: "movie"
                    },
                    {
                        path: "screen"
                    }
                ]
            }
            
        });

    //2. check payment exist

    if(!payment){
        throw new apiError(404, "Payment not found");
    }

    //3. check ownership

    if(payment.user.toString() !== userId.toString()){
        throw new apiError(403, "you are not authorised to view this payment");
    }

    return res
        .status(200)
        .json(new apiResponse(200, payment, "Payment fetched Successfully"));

});

const getMyPayments = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    // 1. Find all payments of logged-in user

    const payments = await Payment 
        .find({ user: userId })
        .populate({
            path: "booking",
            populate:{
                path: "show",
                populate: [
                    {
                        path: "movie"
                    },
                    {
                        path: "screen"
                    }
                ]
            }
        }).sort({ createdAt: -1 });

        return res
            .status(200)
            .json(new apiResponse(200, payments, "Payment History Fetched"));
});

const refundPayment = asyncHandler(async(req, res)=>{
    const { paymentId } = req.params;

    const userId = req.user._id;

    //1 find payment

    const payment = await Payment.findById(paymentId);

    if(!payment){
         throw new apiError(404, "Payment bot found")
    }

    //2. check payment ownership

    if(payment.user.toString() !== userId.toString()){
        throw new apiError(403, "You re not a authorised user to request refund");
    }

    // 3 check payment status

    if(payment.paymentStatus !== "SUCCESS"){
        throw new apiError(400, "Only Successfull payments can be refunded");
    }

    // 4. find booking

    const booking = await Booking.findById(payment.booking);

    if(!booking){
        throw new apiError(404, "Booking not found");
    }

    //5 update payment status

    payment.paymentStatus = "REFUND_PENDING";
    await payment.save();

    //6 update booking payment status

    booking.paymentStatus = "REFUND_PENDING";
    await booking.save();

    return res
        .status(200)
        .json(new apiResponse(200,{ payment, booking }, "Refund requested successfully"));
});

const processRefund = asyncHandler(async(req, res)=>{
    const { paymentId } = req.params;

    //1. find payment
    const payment = await Payment.findById(paymentId);

    if(!payment){
        throw new apiError(404, "payment not found");
    }

    //2. check refund status

    if(payment.paymentStatus !== "REFUND_PENDING"){
        throw new apiError(400, "Payment is not pending for refund");
    };

    //3. Find booking

    const booking = await Booking
        .findById(payment.booking)
        .populate("user", "-password -refreshToken");

    if(!booking){
        throw new apiError(404, "Bookinf not found");
    }

    //4. Process refund

    payment.paymentStatus = "REFUNDED";
    await payment.save();

    //5. update booking payment status

    booking.paymentStatus = "REFUNDED"
    await booking.save();

    //6. send refund email

    try {
        await sendNotification({
            to: booking.user.email,
            subject: "Booking Refund SuccessFul",
            message: `Your Booking Refund has been processed successfully
            Booking ID: ${booking._id}
            Refund Amount: Rs${payment.amount}
            Your Payment of Rs${payment.amount}has been Refunded
            Thank You for using our service`
        })
    } catch (error) {
        console.log("Failed to send refund email:", error);
    }

    return res
        .status(200)
        .json(new apiResponse(200, { payment, booking }, "Payment refunded successfully"));
});

export {
    createPayment,
    updatePaymentStatus, 
    getPaymentById,
    getMyPayments,
    refundPayment,
    processRefund
};