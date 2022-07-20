const sequelize = require("../db");
const {DataTypes} = require("sequelize");


const Member = sequelize.define('member', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    memberDomain: {type: DataTypes.STRING, allowNull:false},
    memberVkId: {type: DataTypes.STRING, allowNull: false}
},{
    timestamps: false
})

module.exports = Member;