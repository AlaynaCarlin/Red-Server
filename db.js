const Sequelize = require('sequelize');

// ! use database url
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    // ! comment inn on heroku. local server does not support ssl
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }
});

module.exports = sequelize;