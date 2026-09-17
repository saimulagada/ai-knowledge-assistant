const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Document = sequelize.define("Document", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM(
      "PROCESSING",
      "COMPLETED",
      "FAILED"
    ),
    defaultValue: "PROCESSING",
    allowNull: false,
  },
});

module.exports = Document;