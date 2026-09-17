const userService = require("../services/userService");
const AppError = require("../errors/AppError");

class UserController {
  async register(req, res) {
    try {
      const user = await userService.register(req.body);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error.message === "Email already exists") {
        throw new AppError(error.message, 409);
      }

      throw error;
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const data = await userService.login(email, password);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      throw new AppError(error.message || "Invalid email or password", 401);
    }
  }

  async profile(req, res) {
    try {

      const user = await userService.getProfile(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });

    } catch (error) {
      if (error.message === "User not found") {
        throw new AppError(error.message, 404);
      }

      throw error;

    }
  }
}

module.exports = new UserController();