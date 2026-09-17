const { Queue } = require("bullmq");
const { getBullMQConnectionOptions } = require("../config/redisOptions");

const documentQueue = new Queue("document-processing", {
  connection: getBullMQConnectionOptions(),
});

module.exports = documentQueue;
