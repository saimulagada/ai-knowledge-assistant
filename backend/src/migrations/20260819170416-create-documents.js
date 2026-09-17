"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("documents", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      originalName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      filePath: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "PROCESSING",
          "COMPLETED",
          "FAILED"
        ),
        allowNull: false,
        defaultValue: "PROCESSING",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("documents");
  },
};