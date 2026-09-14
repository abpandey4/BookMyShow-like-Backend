import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true
        },
        role:{
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        },
        avatar:{
            type: String
        }, 
        coverImage:{
            type: String
        },
        refreshToken:{
            type: String
        }
    },{
        timestamps: true
      }
);

userSchema.pre("save", async function(){                  // this piece of code we wrote because we want to 
    if(!this.isModified("password")){                     // save the password in hash (encypted) and also 
        return ;                                    //  and pre(save) is before hashing save the password
    }
    this.password = await bcrypt.hash(this.password, 10);        // pre-save hook :- bcrypt.hash()
    
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)                         // ispasswordcorrect():- bcrypt.compare()   
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
           _id: this._id,
           username: this.username,
           email: this.email,
           role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)