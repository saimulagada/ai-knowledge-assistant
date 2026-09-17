const DEFAULT_REDIS_URL = "redis://127.0.0.1:6380";

function getRedisUrl() {
   const url = process.env.REDIS_URL || DEFAULT_REDIS_URL;
   console.log("🔴 Redis URL:", url);

     return url;
}

function getBullMQConnectionOptions() {
  const redisUrl = new URL(getRedisUrl());

  if (!["redis:", "rediss:"].includes(redisUrl.protocol)) {
    throw new Error("REDIS_URL must use redis:// or rediss://");
  }

  const db = redisUrl.pathname && redisUrl.pathname !== "/"
    ? Number(redisUrl.pathname.slice(1))
    : undefined;

  const options = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
  };

  if (redisUrl.username) {
    options.username = decodeURIComponent(redisUrl.username);
  }

  if (redisUrl.password) {
    options.password = decodeURIComponent(redisUrl.password);
  }

  if (Number.isInteger(db)) {
    options.db = db;
  }

  if (redisUrl.protocol === "rediss:") {
    options.tls = {};
  }

  return options;
}

module.exports = {
  DEFAULT_REDIS_URL,
  getBullMQConnectionOptions,
  getRedisUrl,
};
