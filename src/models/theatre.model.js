import mongoose, { Schema } from "mongoose";

const theatreSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        location:{
            type: String,
            required: true,
            trim: true
        },
        city:{
            type: String,
            required: true,
            trim: true
        },
        address:{
            type: String,
            required: true,
            trim: true
        },
        screens:{
            type: Number,
            required: true,
            min: 1
        },
        facilties:{
            type: [String],
            default: []
        },
        isActive:{
            type: Boolean,
            default: true
        }
    }, {timestamps: true}
);

export const Theatre = mongoose.model("Theatre", theatreSchema);



