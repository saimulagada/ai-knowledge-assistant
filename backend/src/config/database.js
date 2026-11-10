const { Sequelize } = require("sequelize");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const dbConfig = isProd
  ? {
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialectOptions: {
        ssl: {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        },
      },
    }
  : {
      name: process.env.LOCAL_DB_NAME,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASSWORD,
      host: process.env.LOCAL_DB_HOST,
      port: process.env.LOCAL_DB_PORT,
      dialectOptions: {},
    };

const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: "mysql",
  logging: false,
  dialectOptions: dbConfig.dialectOptions,
});

module.exports = sequelize;
