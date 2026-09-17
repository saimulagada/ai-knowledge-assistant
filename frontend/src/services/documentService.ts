import api from "../api/axios";

export const uploadDocument = async (file: File) => {
  const formData = new FormData();

  formData.append("document", file);

  const response = await api.post(
    "/documents",
    formData
  );

  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get("/documents");

  return response.data;
};