const redisClient = require("../config/redis");

const rateLimit = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate:${ip}`;

    const requests = await redisClient.incr(key);

    if (requests === 1) {
      await redisClient.expire(key, 60);
    }

    if (requests > 5) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Try again in a minute.",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = rateLimit;