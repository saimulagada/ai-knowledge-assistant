const redis = require("../config/redis");


const getChatKey = (userId, conversationId) => {
  return `chat:user:${userId}:conversation:${conversationId}`;
};

const getQueryCountKey = (userId) => {
  return `ai_queries:user:${userId}`;
};


const getChatHistory = async (
  userId,
  conversationId
) => {

  const key = getChatKey(
    userId,
    conversationId
  );

  const history = await redis.get(key);

  if (!history) {
    return [];
  }

  return JSON.parse(history);
};


const saveChatHistory = async (
  userId,
  conversationId,
  userMessage,
  assistantMessage
) => {

  const key = getChatKey(
    userId,
    conversationId
  );

  const history = await getChatHistory(
    userId,
    conversationId
  );

  history.push({
    role: "user",
    content: userMessage
  });

  history.push({
    role: "assistant",
    content: assistantMessage
  });

  // Keep latest 10 messages
  const limitedHistory =
    history.slice(-10);

  await redis.set(
    key,
    JSON.stringify(limitedHistory),
    {
      EX: 60 * 60
    }
  );

  return limitedHistory;
};


const clearChatHistory = async (
  userId,
  conversationId
) => {

  const key = getChatKey(
    userId,
    conversationId
  );

  await redis.del(key);
};

const incrementQueryCount = async (userId) => {
  const key = getQueryCountKey(userId);

  return await redis.incr(key);
};

const getQueryCount = async (userId) => {
  const key = getQueryCountKey(userId);
  const count = await redis.get(key);

  return Number(count || 0);
};

module.exports = {
  getChatHistory,
  saveChatHistory,
  clearChatHistory,
  incrementQueryCount,
  getQueryCount
};
