import mongoose, {Schema} from "mongoose";

const movieSchema = Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        description:{
            type: String,
            required: true,
            trim: true
        },
        genre:{
            type: [String],
            required: true
        },
        duration:{
            type: Number,
            required: true
        },
        releaseDate:{
            type: Date,
            required: true
        },
        poster:{
            type: String
        },
        trailer:{
            type: String
        },
        cast:{
            type:[String],
            default: []
        },
        language:{
            type: [String],
            required: true
        },
        rating:{
            type: Number,
            default: 0
        },
        crew:{
            type:[String],
            default: []
        },
        embedding: {
            type:[Number],
            default: undefined
        }

    }, {timestamps: true}
);

//indexes

movieSchema.index({ title: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ language: 1 });

export const Movie = mongoose.model("Movie", movieSchema);