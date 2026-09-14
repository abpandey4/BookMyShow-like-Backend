import mongoose, { Schema } from "mongoose";

const screenSchema = new Schema(
    {
       theatre:{
        type: Schema.Types.ObjectId,
        ref: "Theatre",
        required: true
       },

       name:{
        type: String,
        required: true,
        trim: true
       },

       screenType:{
        type: String,
        enum: ["2D", "3D", "IMAX", "4D"]
       },

       totalSeats:{
        type: Number,
        required: true,
        min: 1
       },

       facilities: {
        type: [String],
        default: []
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

export const Screen = mongoose.model("Screen", screenSchema);