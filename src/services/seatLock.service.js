import redisClient from "../config/redis.js";

const lockSeat = async( showId, seatId, userId, expiry = 300) =>{
    const key = `seatLock:${showId}:${seatId}`;

    const result = await redisClient.set(key,userId,{
            NX: true,                               // only create this key if it does'nt already exists
            EX: expiry
        }
    );

    return result === "OK"
};

const getSeatLock = async(showId, seatId) =>{
    const key = `seatLock:${showId}:${seatId}`;

    return await redisClient.get(key);
};

const releaseSeat = async(showId, seatId)=>{
    const key = `seatLock:${showId}:${seatId}`;
    
    await redisClient.del(key);
};

export {
    lockSeat,
    getSeatLock,
    releaseSeat
}