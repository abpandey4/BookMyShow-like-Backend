import redisClient from "../config/redis.js";

const setCache = async(key, value, expiry = 3600) =>{
    await redisClient.set(key, JSON.stringify(value),{
        EX: expiry
    });
};

const getCache = async(key)=>{
    const data = await redisClient.get(key);

    if(!data){
        return null;
    }

    return JSON.parse(data);
};

const deleteCache = async(key) =>{
    await redisClient.del(key);
};

export{
    setCache,
    getCache,
    deleteCache
}