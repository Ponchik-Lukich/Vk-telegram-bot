const sequelize = require("../db");
const {DataTypes} = require("sequelize");


const bufferMember = sequelize.define('bufferMember', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    bufMemberDomain: {type: DataTypes.STRING, allowNull:false},
    bufMemberVkId: {type: DataTypes.STRING, allowNull: false},
    userChatId: {type: DataTypes.STRING, allowNull: false},
    action: {type: DataTypes.INTEGER, allowNull: false},
},{
    timestamps: false
})

module.exports = bufferMember;