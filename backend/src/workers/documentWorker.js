const { Worker } = require("bullmq");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { getBullMQConnectionOptions } = require("../config/redisOptions");
const chunkText = require("../utils/chunkText");
const { storeDocument } = require("../services/vectorService");
const documentRepository = require("../repositories/documentRepository");

require("dotenv").config();

console.log("PINECONE_API_KEY exists:", !!process.env.PINECONE_API_KEY);
console.log("PINECONE_INDEX:", process.env.PINECONE_INDEX);

const worker = new Worker(
  "document-processing",

  async (job) => {
    const { documentId, filePath } = job.data;

    console.log("Processing document:", documentId);
    console.log("File:", filePath);

    try {
      // 1. Read PDF
      const pdfBuffer = fs.readFileSync(filePath);

      // 2. Extract text
      const pdfData = await pdfParse(pdfBuffer);

      const text = pdfData.text;

      const chunks = chunkText(text, 500, 50);

      const totalStored = await storeDocument({
        documentId,
        chunks,
      });

      console.log(`${totalStored} chunks stored in Pinecone`);
      console.log("Total chunks:", chunks.length);

      await documentRepository.updateDocumentStatus(documentId, "COMPLETED");

      return {
        documentId,
        characters: text.length,
        chunks: totalStored,
      };
    } catch (error) {
      await documentRepository.updateDocumentStatus(documentId, "FAILED");
      throw error;
    }
  },

   {
    
    connection: getBullMQConnectionOptions(),
  
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});
