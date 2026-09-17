const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.hugging_face_token);

async function generateEmbedding(text) {

    const result = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: text
    });

    return result;
}

module.exports = {
    generateEmbedding
};