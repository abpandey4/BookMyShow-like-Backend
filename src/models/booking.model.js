import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        show:{
            type: Schema.Types.ObjectId,
            ref: "Show",
            required: true
        },
        seats:[
            {
                type: Schema.Types.ObjectId,
                ref: "Seat",
                required: true
            }
        ],
        totalAmount:{
            type: Number,
            required: true,
            min: 0
        },
        status:{
            type: String,
            enum:["PENDING", "CONFIRMED", "CANCELLED"],
            default: "PENDING"
        },
        paymentStatus:{
            type: String,
            enum:["PENDING", "PAID", "FAILED", "REFUNDED", "REFUND_PENDING"],
            default:"PENDING"
        }
    },
    {
        timestamps: true
    }
);

export const Booking = mongoose.model("Booking", bookingSchema);