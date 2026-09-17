const express = require("express");

const {
  createDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
} = require("../controllers/documentController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const asyncHandler = require("../middleware/asyncHandler");
const { validate, validateDocumentId } = require("../middleware/validate");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("document"),
  asyncHandler(createDocument)
);

router.get(
  "/",
  authMiddleware,
  asyncHandler(getUserDocuments)
);

router.get(
  "/:id",
  authMiddleware,
  validate(validateDocumentId),
  asyncHandler(getDocumentById)
);

router.delete(
  "/:id",
  authMiddleware,
  validate(validateDocumentId),
  asyncHandler(deleteDocument)
);

module.exports = router;