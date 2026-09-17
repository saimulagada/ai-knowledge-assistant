const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const rateLimit =require("../middleware/rateLimit");
const asyncHandler = require("../middleware/asyncHandler");
const { validate, validateRegister, validateLogin } = require("../middleware/validate");

router.post("/register", validate(validateRegister), asyncHandler(userController.register.bind(userController)));

router.post("/login", validate(validateLogin), asyncHandler(userController.login.bind(userController)));

router.get(
  "/profile",
  authMiddleware,
  asyncHandler(userController.profile.bind(userController))
);

router.get("/hello", rateLimit, (req, res) => {
  res.json({ message: "Hello" });
});

module.exports = router;