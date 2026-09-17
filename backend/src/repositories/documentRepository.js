const { Document } = require("../models");

const createDocument = async (data) => {
  return await Document.create(data);
};

const findDocumentById = async (id) => {
  return await Document.findByPk(id);
};

const findDocumentsByUser = async (userId) => {
  return await Document.findAll({
    where: {
      userId,
    },
    order: [["createdAt", "DESC"]],
  });
};

const updateDocumentStatus = async (id, status) => {
  const document = await Document.findByPk(id);

  if (!document) {
    return null;
  }

  document.status = status;

  await document.save();

  return document;
};

const deleteDocument = async (id) => {
  const document = await Document.findByPk(id);

  if (!document) {
    return null;
  }

  await document.destroy();

  return document;
};

module.exports = {
  createDocument,
  findDocumentById,
  findDocumentsByUser,
  updateDocumentStatus,
  deleteDocument,
};