import redisClient from "../config/redis.js";

// 🔹 Get projects from cache
export const getProjectsCache = async (key) => {
  const data = await redisClient.get(`rahnimoProjects:${key}`);
  return data ? JSON.parse(data) : null;
};

// 🔹 Set projects cache
export const setProjectsCache = async (key, value, ttl = 3600) => {
  await redisClient.set(
    `rahnimoProjects:${key}`,
    JSON.stringify(value),
    "EX",
    ttl 
  );
};

// 🔹 Delete ALL projects cache
export const deleteProjectsCache = async () => {
  const keys = await redisClient.keys("rahnimoProjects:*");
  if (keys.length) await redisClient.del(keys);
};

export const getProjectByIdCache = async (id) => {
  const data = await redisClient.get(`rahnimoProject:${id}`);
  return data ? JSON.parse(data) : null;
};

export const setProjectByIdCache = async (id, project, ttl = 3600) => {
  await redisClient.set(
    `rahnimoProject:${id}`,
    JSON.stringify(project),
    "EX",
    ttl 
  );
};

export const deleteProductByIdCache = async (id) => {
  await redisClient.del(`rahnimoProject:${id}`);
};
