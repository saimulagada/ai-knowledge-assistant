const buildPrompt = (question, contexts) => {

  const contextText = contexts
    .map((context, index) => {
      return `Context ${index + 1}:
${context}`;
    })
    .join("\n\n");

  return `
You are an AI Knowledge Assistant.

Answer the user's question using ONLY the information provided in the context.

Rules:
1. Do not use outside knowledge.
2. Do not make up information.
3. If the answer is not available in the context, clearly say:
   "I couldn't find this information in the uploaded documents."
4. Keep the answer clear and concise.
5. Answer the question directly.

Context:
${contextText}

User Question:
${question}

Answer:
`;
};

module.exports = buildPrompt;