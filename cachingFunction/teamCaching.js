import redisClient from "../config/redis.js";


// 🔹 Get team from cache
export const getTeamsCache = async (key) => {
  const data = await redisClient.get(`rahnimoTeams:${key}`);
  return data ? JSON.parse(data) : null;
};

// 🔹 Set Team cache
export const setTeamsCache = async (key, value, ttl = 3600) => {
  await redisClient.set(
    `rahnimoTeams:${key}`,
    JSON.stringify(value),
    "EX",
    ttl 
  );
};


// 🔹 Delete ALL projects cache
export const deleteTeamsCache = async () => {
  const keys = await redisClient.keys("rahnimoTeams:*");
  if (keys.length) await redisClient.del(keys);
};

export const getTeamByIdCache = async (id) => {
  const data = await redisClient.get(`rahnimoTeam:${id}`);
  return data ? JSON.parse(data) : null;
};

export const setTeamByIdCache = async (id, project, ttl = 3600) => {
  await redisClient.set(
    `rahnimoTeam:${id}`,
    JSON.stringify(project),
    "EX",
    ttl 
  );
};

export const deleteTeamByIdCache = async (id) => {
  await redisClient.del(`rahnimoTeam:${id}`);
};