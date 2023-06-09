'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CustomerArticles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CustomerId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Customers',
          key:'id'
        }
      },
      ArticleId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Articles',
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CustomerArticles');
  }
};