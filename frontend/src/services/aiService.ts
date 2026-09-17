import api from "../api/axios";

export const askAI = async (question: string) => {
  const response = await api.post("/ai/ask", {
    question,
  });

  return response.data;
};

export const getAIStats = async () => {
  const response = await api.get("/ai/stats");

  return response.data;
};
