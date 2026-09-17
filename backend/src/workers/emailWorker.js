const { Worker } = require("bullmq");
const sendEmail = require("../utils/email");
const { getWelcomeTemplate } = require("../email/templateService");
const { getBullMQConnectionOptions } = require("../config/redisOptions");

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("JOB RECEIVED");

    console.log(job.data);

    const { name, email } = job.data;

    const html = getWelcomeTemplate(
      name,
      "http://localhost:3000/verify/123"
    );

    try {
      console.log("Sending email to:", email);

      await sendEmail({
        to: email,
        subject: "Welcome",
        html,
      });

      console.log("✅ Email Sent");
    } catch (err) {
      console.error("❌ Email Failed");
      console.error(err);
    }
  },
  {
    connection: getBullMQConnectionOptions(),
  }
);

worker.on("failed", (job, err) => {
  console.log("Job Failed");
  console.log(err);
});

worker.on("completed", (job) => {
  console.log("Job Completed");
});
