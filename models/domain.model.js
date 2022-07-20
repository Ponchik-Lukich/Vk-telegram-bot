const sequelize = require("../db");
const {DataTypes} = require("sequelize");


const Domain = sequelize.define('domain', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    domainId: {type: DataTypes.STRING, allowNull:false},
    userChatId: {type: DataTypes.STRING, allowNull: false}
},{
    timestamps: false
})

module.exports = Domain;