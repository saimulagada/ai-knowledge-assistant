require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");
const redisClient = require("./config/redis");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {

        await sequelize.authenticate();
        await sequelize.sync();


        console.log("Database Connected");

         await redisClient.connect();

         console.log("Redis Connected");

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

    } catch (error) {

        console.error(error);
        process.exitCode = 1;

    }
}

startServer();