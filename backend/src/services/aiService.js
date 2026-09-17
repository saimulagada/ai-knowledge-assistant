const groq = require("../config/groq");
const documentRepository = require("../repositories/documentRepository");

const {
  searchDocuments
} = require("./vectorService");

const {
  generateEmbedding
} = require("./embeddingService");

const buildPrompt = require("../utils/buildPrompt");

const {
  getChatHistory,
  saveChatHistory,
  incrementQueryCount,
  getQueryCount
} = require("./chatMemoryService");


const askAI = async (question, userId, conversationId) => {

  // 1. Get previous conversation from Redis
  const chatHistory = await getChatHistory(userId, conversationId);

  await incrementQueryCount(userId);

  // 2. Create contextual search query
  const previousConversation = chatHistory
    .map((message) => message.content)
    .join("\n");

  const searchQuery = `
Previous conversation:
${previousConversation}

Current question:
${question}
`;

  console.log("Search Query:", searchQuery);

  // 3. Search Pinecone
  const results = await searchDocuments({
    query: searchQuery,
    generateEmbedding
  });

  // 4. No relevant documents found
  if (results.length === 0) {
    return {
      answer:
        "I couldn't find relevant information in the uploaded documents.",
      sources: []
    };
  }

  // 5. Extract text from retrieved chunks
  const contexts = results
    .map((result) => result.metadata?.text)
    .filter(Boolean);

  // 6. Build RAG prompt
  const prompt = buildPrompt(
    question,
    contexts
  );

  // 7. Build messages for Groq
  const messages = [
    {
      role: "system",
      content:
        "You are an AI Knowledge Assistant. Answer only using the provided document context."
    },

    // Previous conversation
    ...chatHistory,

    // Current question + document context
    {
      role: "user",
      content: prompt
    }
  ];

  // 8. Send to Groq
  const response =
    await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,
      messages
    });

  // 9. Get answer
  const answer =
    response.choices?.[0]?.message?.content ||
    "I couldn't generate an answer.";

  // 10. Save conversation to Redis
await saveChatHistory(
  userId,
  conversationId,
  question,
  answer
);

  // 11. Get unique document IDs
  const documentIds = [
    ...new Set(
      results
        .map(
          (result) =>
            result.metadata?.documentId
        )
        .filter(Boolean)
    )
  ];

  // 12. Get source information
  const sources = [];

  for (const documentId of documentIds) {

    const document =
      await documentRepository.findDocumentById(
        documentId
      );

    if (!document) continue;

    sources.push({
      documentId: document.id,
      fileName: document.originalName
    });
  }

  // 13. Return answer + sources
  return {
    answer,
    sources
  };
};

const getAIStats = async (userId) => {
  const queryCount = await getQueryCount(userId);

  return {
    queryCount
  };
};

module.exports = {
  askAI,
  getAIStats
};
