import mongoose, { Schema } from "mongoose";

const showSeatSchema = new Schema({
    show:{
        type: Schema.Types.ObjectId,
        ref: "Show",
        required: true
    },
    seat:{
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: true
    },
    status:{
        type: String,
        enum: ["AVAILABLE", "LOCKED", "BOOKED"],
        default: "AVAILALE"
    },
    lockedAt:{
        type: Date,
        default: null
    }
},{
    timestamps: true
}
);

showSeatSchema.index(
    {
        show: 1,
        seat: 1,
    },
    {
        unique: true
    }
);

export const ShowSeat = mongoose.model("ShowSeat", showSeatSchema);