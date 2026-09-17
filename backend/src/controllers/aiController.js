// const aiService = require("../services/aiService");

// class AIController {

//     async askAI(req, res) {

//         try {

//             const { message } = req.body;

//             const response = await aiService.askAI(message);

//             res.json({
//                 success: true,
//                 response
//             });

//         } catch (error) {

//             console.error(error);

//             res.status(500).json({
//                 success: false,
//                 message: "Something went wrong"
//             });

//         }

//     }

// }

// module.exports = new AIController();
const aiService = require("../services/aiService");
const AppError = require("../errors/AppError");

const askAI = async (req, res) => {
  const question = req.body.question || req.body.message;
  const conversationId =
    req.body.conversationId || req.body.conversation_id || req.body.chatId || "default";

  try {
    const answer = await aiService.askAI(question, req.user.id, conversationId);

    return res.status(200).json({
      success: true,
      answer: answer.answer,
      sources: answer.sources,
    });
  } catch (error) {
    throw new AppError("Failed to generate answer", 502);
  }
};

const getAIStats = async (req, res) => {
  const stats = await aiService.getAIStats(req.user.id);

  return res.status(200).json({
    success: true,
    data: stats,
  });
};

module.exports = {
  askAI,
  getAIStats,
};
