const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const emailQueue = require("../queues/emailQueue");

const userRepository = require("../repositories/userRepository");

class UserService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword;

   const user=await userRepository.create(userData);
    await emailQueue.add(
      "welcome-email",

      {
        name: user.name,

        email: user.email,
      },
    );
    console.log("Queue Job Added");
    return user;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getProfile(userId) {
    const cacheKey = `profile:${userId}`;

    // Check Redis
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      console.log("✅ Cache Hit");

      return JSON.parse(cachedUser);
    }

    console.log("❌ Cache Miss");

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Store in Redis for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(user));

    return user;
  }

  async updateProfile(userId, data) {
    await userRepository.update(userId, data);

    await redisClient.del(`profile:${userId}`);

    return true;
  }
}

module.exports = new UserService();
