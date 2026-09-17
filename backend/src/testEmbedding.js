require("dotenv").config();

const {
    generateEmbedding
} = require("./services/embeddingService");

async function test() {

    const texts = [
    "Employees receive 20 days of annual leave.",
    "Workers get 20 vacation days every year.",
    "The company provides free coffee in the office."
];

for (const text of texts) {

    const embedding = await generateEmbedding(text);

    console.log("\nTEXT:");
    console.log(text);

    console.log("VECTOR SIZE:");
    console.log(embedding.length);
}
}

test();