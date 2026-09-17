require("dotenv").config();

const { storeDocument } = require("./services/vectorService");

async function test() {

    await storeDocument(
        "leave-001",
        "Employees receive 20 days of annual leave every year."
    );

}

test();