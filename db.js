const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT
});

module.exports = sequelize;