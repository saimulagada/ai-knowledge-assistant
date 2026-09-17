const documentService = require("../services/documentService");
const AppError = require("../errors/AppError");

const createDocument = async (req, res) => {
  if (!req.file) {
    throw new AppError("PDF file is required", 400);
  }

    const userId = req.user.id;

    const document = await documentService.createDocument({
      userId,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      status: "PROCESSING",
    });

  return res.status(201).json({
    success: true,
    message: "Document uploaded successfully",
    data: document,
  });
};

const getUserDocuments = async (req, res) => {
  const userId = req.user.id;
  const documents = await documentService.getUserDocuments(userId);

  return res.status(200).json({
    success: true,
    data: documents,
  });
};

const getDocumentById = async (req, res) => {
  const { id } = req.params;
  const document = await documentService.getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

  return res.status(200).json({
    success: true,
    data: document,
  });
};

const deleteDocument = async (req, res) => {
  const { id } = req.params;
  const document = await documentService.deleteDocument(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

  return res.status(200).json({
    success: true,
    message: "Document deleted successfully",
  });
};

module.exports = {
  createDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
};