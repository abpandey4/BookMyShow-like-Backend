import mongoose, { Schema } from "mongoose";

const showSchema = new Schema(
    {
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true
        },
        screen:{
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: true
        },
        showDate:{
            type: Date,
            required: true
        },
        startTime:{
            type: String,
            required: true
        },
        endTime:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true,
            min: 0
        },
        language:{
            type: String,
            required: true,
            trim: true
        },
        format:{
            type: String,
            enum: ["2D", "3D", "IMAX", "4DX"],
            default : "2D"
        },
        isActive:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export const Show = mongoose.model("Show", showSchema)