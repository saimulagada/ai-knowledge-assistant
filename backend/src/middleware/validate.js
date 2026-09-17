const AppError = require("../errors/AppError");

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const validate = (validator) => (req, res, next) => {
  const result = validator(req);

  if (result.length > 0) {
    return next(new AppError("Request validation failed", 400, result));
  }

  return next();
};

const validateRegister = (req) => {
  const body = isPlainObject(req.body) ? req.body : {};
  const errors = [];

  if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 100) {
    errors.push({ field: "name", message: "Name must be between 2 and 100 characters" });
  }

  if (
    typeof body.email !== "string" ||
    body.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
  ) {
    errors.push({ field: "email", message: "A valid email is required" });
  }

  if (typeof body.password !== "string" || body.password.length < 8 || body.password.length > 128) {
    errors.push({ field: "password", message: "Password must be between 8 and 128 characters" });
  }

  return errors;
};

const validateLogin = (req) => {
  const body = isPlainObject(req.body) ? req.body : {};
  const errors = [];

  if (typeof body.email !== "string" || !body.email.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  }

  if (typeof body.password !== "string" || !body.password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
};

const validateAsk = (req) => {
  const body = isPlainObject(req.body) ? req.body : {};
  const question = body.question ?? body.message;
  const errors = [];

  if (typeof question !== "string" || !question.trim() || question.trim().length > 4000) {
    errors.push({ field: "question", message: "Question must be between 1 and 4000 characters" });
  }

  const conversationId = body.conversationId ?? body.conversation_id ?? body.chatId;
  if (conversationId !== undefined && (typeof conversationId !== "string" || !conversationId.trim() || conversationId.length > 100)) {
    errors.push({ field: "conversationId", message: "Conversation ID must be between 1 and 100 characters" });
  }

  return errors;
};

const validateDocumentId = (req) => {
  if (!/^\d+$/.test(req.params.id) || Number(req.params.id) < 1) {
    return [{ field: "id", message: "Document ID must be a positive integer" }];
  }

  return [];
};

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateAsk,
  validateDocumentId,
};