import redisClient from "../config/redis.js";


// 🔹 Get team from cache
export const getTeamsCache = async (key) => {
  const data = await redisClient.get(`teams:${key}`);
  return data ? JSON.parse(data) : null;
};

// 🔹 Set Team cache
export const setTeamsCache = async (key, value, ttl = 3600) => {
  await redisClient.set(
    `teams:${key}`,
    JSON.stringify(value),
    "EX",
    ttl 
  );
};


export const getTeamByIdCache = async (id) => {
  const data = await redisClient.get(`team:${id}`);
  return data ? JSON.parse(data) : null;
};

export const setTeamByIdCache = async (id, project, ttl = 3600) => {
  await redisClient.set(
    `team:${id}`,
    JSON.stringify(project),
    "EX",
    ttl 
  );
};

// 🔹 Delete ALL projects cache
export const deleteTeamsCache = async () => {
  const keys = await redisClient.keys("teams:*");
  if (keys.length) await redisClient.del(keys);
};

export const deleteTeamByIdCache = async (id) => {
  await redisClient.del(`team:${id}`);
};