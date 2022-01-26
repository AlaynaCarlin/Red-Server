const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:4e252eccce7c4a18b1cb1fad4832dbc0@localhost:5432/Class&Sass");

module.exports = sequelize;