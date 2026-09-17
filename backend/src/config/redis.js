const { createClient } = require("redis");
const { getRedisUrl } = require("./redisOptions");

const client = createClient({
  url: getRedisUrl(),
});

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

module.exports = client;
