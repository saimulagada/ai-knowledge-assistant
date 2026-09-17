const { Queue } = require("bullmq");
const { getBullMQConnectionOptions } = require("../config/redisOptions");

const emailQueue = new Queue("email-queue", {
    connection: getBullMQConnectionOptions()
});

module.exports = emailQueue;
