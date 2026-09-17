const documentRepository = require("../repositories/documentRepository");
const documentQueue = require("../queues/documentQueue");

const createDocument = async (data) => {
  const document = await documentRepository.createDocument(data);

  await documentQueue.add("process-document", {
    documentId: document.id,
    filePath: document.filePath,
  });

  return document;
};

const getDocumentById = async (id) => {
  return await documentRepository.findDocumentById(id);
};

const getUserDocuments = async (userId) => {
  return await documentRepository.findDocumentsByUser(userId);
};

const updateDocumentStatus = async (id, status) => {
  return await documentRepository.updateDocumentStatus(id, status);
};

const deleteDocument = async (id) => {
  return await documentRepository.deleteDocument(id);
};

module.exports = {
  createDocument,
  getDocumentById,
  getUserDocuments,
  updateDocumentStatus,
  deleteDocument,
};