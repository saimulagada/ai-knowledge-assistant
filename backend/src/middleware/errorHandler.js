const multer = require("multer");
const AppError = require("../errors/AppError");

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

const errorHandler = (error, req, res, next) => {
  let normalizedError = error;

  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? "PDF file must be 10 MB or smaller" : "Invalid file upload";
    normalizedError = new AppError(message, 400);
  } else if (error?.message === "Only PDF files are allowed") {
    normalizedError = new AppError(error.message, 400);
  } else if (error?.name === "SequelizeUniqueConstraintError") {
    normalizedError = new AppError("Email already exists", 409);
  } else if (error?.name === "SequelizeValidationError") {
    normalizedError = new AppError("Request validation failed", 400, error.errors.map(({ path, message }) => ({ field: path, message })));
  } else if (error?.type === "entity.parse.failed") {
    normalizedError = new AppError("Request body must contain valid JSON", 400);
  }

  const statusCode = normalizedError.statusCode || 500;
  const response = {
    success: false,
    message: statusCode >= 500 ? "Internal server error" : normalizedError.message,
  };

  if (normalizedError.details) {
    response.errors = normalizedError.details;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};