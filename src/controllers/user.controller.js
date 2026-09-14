import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async(req,res)=>{
    const{username, fullname, email, password} = req.body;

    if(!username || !fullname || !email || !password){
        throw new apiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or:[{username}, {email}]
    })

    if(existingUser){
        throw new apiError(409, "Username or email already Exists")
    }

    const user  = await User.create({
        username,
        fullname,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User Register Successfully"  ))
});

const loginUser = asyncHandler(async(req,res)=>{
    const{email, username, password} = req.body

    if((!email && !username) || !password){
        throw new apiError(400, "Email/username & password is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new apiError(404, "User does'nt exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401, "Invalid User credentials")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    user.refreshToken = refreshToken                 // save refresh token  in DB
    await user.save({validateBeforeSave: false})

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User LoggedIn Successfull"
        )
    )

});

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(
        new apiResponse(200, req.user, "Current User fetched Successfully")
    )
});

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset:{                               // this removes the refresh TOken field from that users mongodb doc
                refreshToken:1
            }
        },
        {
            new: true
        }
    );

    const options = {    
        httpOnly: true,              //by using this code the cookies are modified by only servers so frontend guys cant modified
        secure: true                 // otherwise by default even frontend can also modify the cookies 
    };

   
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User logged out Sucessfully")
        );
});

//RefreshAccess Token's  whole point of this endpoint is to get a 
//new access token when the old access token has expired.

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "RefreshToken is required")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id);
        if(!user){
            throw new apiError(401, "Invalid Refresh Toekn")
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new apiError(401, "Refresh TOken is Expired Or Used")
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave:false})

        return res
            .status(200)
            .json(
                new apiResponse(200,{accessToken, refreshToken}, "Access Token Refreshed Successfully")
            )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid RefreshToken")
    }
})

export { 
    registerUser, 
    loginUser, 
    getCurrentUser, 
    logoutUser, 
    refreshAccessToken 
};