'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // បញ្ចូលទិន្នន័យគំរូទៅក្នុង Table "Students"
    await queryInterface.bulkInsert('Students', [
      {
        name: 'Sok Chea',
        age: 18,
        grade: '12A',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vannak Sing',
        age: 17,
        grade: '11B',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // លុបទិន្នន័យគំរូទាំងអស់វិញ ប្រសិនបើមានការធ្វើ Rollback
    await queryInterface.bulkDelete('Students', null, {});
  }
};