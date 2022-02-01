const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.DATABASE_URL, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;