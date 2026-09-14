import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        booking:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true
        },
        amount:{
            type: Number,
            required: true,
            min: 0
        },
        paymentMethod:{
            type: String,
            enum: ["CARD", "UPI", "NET_BANKING", "WALLET"],
            required: true
        },
        paymentStatus:{
            type: String,
            enum: [
                "PENDING",
                "SUCCESS",
                "FAILED",
                "REFUND_PENDING",
                "REFUNDED"
            ],
            default: "PENDING"
        },
        transactionId:{
            type: String,
            unique: true,
            sparse: true
        }
    },
    {
        timestamps: true
    }
);

export const Payment = mongoose.model("Payment", paymentSchema);