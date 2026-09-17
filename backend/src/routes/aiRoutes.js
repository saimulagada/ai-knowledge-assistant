const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { askAI, getAIStats } = require("../controllers/aiController");
const asyncHandler = require("../middleware/asyncHandler");
const { validate, validateAsk } = require("../middleware/validate");

router.post("/ask", authMiddleware, validate(validateAsk), asyncHandler(askAI));
router.get("/stats", authMiddleware, asyncHandler(getAIStats));

module.exports = router;
