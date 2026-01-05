import redisClient from "../config/redis.js";


// 🔹 Get projects from cache
export const getTeamsCache = async (key) => {
  const data = await redisClient.get(`teams:${key}`);
  return data ? JSON.parse(data) : null;
};

// 🔹 Set projects cache
export const setTeamsCache = async (key, value, ttl = 3600) => {
  await redisClient.set(
    `teams:${key}`,
    JSON.stringify(value),
    "EX",
    ttl 
  );
};

// 🔹 Delete ALL projects cache
export const deleteTeamsCache = async () => {
  const keys = await redisClient.keys("teams:*");
  if (keys.length) await redisClient.del(keys);
};