'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Customers','username',Sequelize.STRING)
    await queryInterface.addColumn('Customers','first_name',Sequelize.STRING)
    await queryInterface.addColumn('Customers','last_name',Sequelize.STRING)
    await queryInterface.addColumn('Customers','profile_picture',Sequelize.STRING)
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Customers','username')
    await queryInterface.removeColumn('Customers','first_name')
    await queryInterface.removeColumn('Customers','last_name')
    await queryInterface.removeColumn('Customers','profile_picture')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
