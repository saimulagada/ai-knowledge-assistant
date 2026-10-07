// const { InferenceClient } = require("@huggingface/inference");

// const client = new InferenceClient(process.env.hugging_face_token);

// async function generateEmbedding(text) {

//     const result = await client.featureExtraction({
//         model: "sentence-transformers/all-MiniLM-L6-v2",
//         inputs: text
//     });

//     return result;
// }

// module.exports = {
//     generateEmbedding
// };
const { pipeline } = require("@huggingface/transformers");

let extractor;

async function getExtractor() {
    if (!extractor) {
        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }

    return extractor;
}

async function generateEmbedding(text) {
    const model = await getExtractor();

    const output = await model(text, {
        pooling: "mean",
        normalize: true
    });

    return Array.from(output.data);
}

module.exports = {
    generateEmbedding
};