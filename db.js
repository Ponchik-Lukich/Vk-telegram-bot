const {Sequelize} = require("sequelize");


module.exports = new Sequelize(
    process.env.BD_NAME,
    process.env.BD_USER_NAME,
    process.env.BD_PASSWORD,
    {
        host: process.env.BD_HOST,
        port: '3306',
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }

)