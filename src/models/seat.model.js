import mongoose, { Schema } from "mongoose";

const seatSchema = new Schema(
    {
        screen:{
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: true
        },

        seatNumber:{
            type: String,
            required: true,
            trim: true
        },
        row:{
            type: String,
            required: true,
            trime: true
        },
        seatType:{
            type: String,
            enum: ["REGULAR", "PREMIUM", "RECLINER"],
            default: "REGULAR"
        },
        price:{
            type: Number,
            required: true,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);
seatSchema.index(
    {screen:1, seatNumber: 1},
    { unique: true }
)

export const Seat = mongoose.model("Seat", seatSchema);

