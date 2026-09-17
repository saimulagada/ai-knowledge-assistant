require("dotenv").config();

const {
  searchDocuments,
} = require("./services/vectorService");

const { generateEmbedding } = require("./services/embeddingService");

const test = async () => {
  const question =
    "How many annual leave days do employees receive?";

  const results = await searchDocuments({
    query: question,
    generateEmbedding,
  });

  console.log("\nSEARCH RESULTS:\n");

  results.forEach((result, index) => {
    console.log(`--- RESULT ${index + 1} ---`);

    console.log("Score:", result.score);

    console.log(
      "Text:",
      result.metadata?.text
    );
  });
};

test();