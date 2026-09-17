require("dotenv").config();
const pinecone = require("../config/pinecone");
const { generateEmbedding } = require("./embeddingService");

const index = pinecone.index(process.env.PINECONE_INDEX);

/**
 * Store a document as multiple chunks in Pinecone
 */
async function storeDocument({ documentId, chunks }) {
  const records = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    if (!chunk || !chunk.trim()) {
      continue;
    }

    const embedding = await generateEmbedding(chunk);

    records.push({
      id: `document-${documentId}-chunk-${i}`,

      values: embedding,

      metadata: {
        documentId: String(documentId),
        chunkIndex: i,
        text: chunk,
      },
    });
  }

  if (records.length === 0) {
    throw new Error("No chunks available for Pinecone upsert");
  }

  await index.upsert({
    records,
  });

  console.log(`✅ ${records.length} chunks stored in Pinecone`);

  return records.length;
}

/**
 * Search documents using semantic similarity
 */
const searchDocuments = async ({
  query,
  generateEmbedding
}) => {

  const queryEmbedding =
    await generateEmbedding(query);

  console.log("Query:", query);
  console.log("Embedding length:", queryEmbedding.length);

  const result = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  console.log(
    "Pinecone raw matches:",
    JSON.stringify(result.matches, null, 2)
  );

  const threshold = 0.10;

  const matches = result.matches.filter(
    (match) => match.score >= threshold
  );

  console.log(
    "Matches after threshold:",
    JSON.stringify(matches, null, 2)
  );

  return matches;
};

module.exports = {
  storeDocument,
  searchDocuments,
};