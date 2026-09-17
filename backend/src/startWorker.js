require("dotenv").config();

require("./workers/emailWorker");
require("./workers/documentWorker");

console.log("Worker Started...");
