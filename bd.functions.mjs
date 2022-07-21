import models from "./models/models.js";
import {Op} from "sequelize";

async function findMembers(checkDomain) {
    const users = await models.Member.findAll({where: {memberDomain: checkDomain}});
    let oldMemberArray = [];
    for (let i = 0; i < users.length; i++) {
        oldMemberArray.push(parseInt(users[i].memberVkId))
    }
    return oldMemberArray
}

async function bufferManager(membersJoined, membersLeft, domain, secondUserChatId) {
    if (membersJoined.length !== 0) {
        let membersJWrite = membersJoined.map(item => {return {memberDomain: domain, memberVkId: item.toString()}})
        let bufferMembersJWrite = membersJoined.map(item => {return {bufMemberDomain: domain, bufMemberVkId: item.toString(), userChatId: secondUserChatId, action: 1}})
        await models.Member.bulkCreate(membersJWrite)
        await models.bufferMember.bulkCreate(bufferMembersJWrite, {updateOnDuplicate: ["bufMemberDomain", "bufMemberVkId", "userChatId"]})
    }
    if (membersLeft.length !== 0) {
        let membersLDestroy = membersLeft.map(item => {return {memberDomain: domain, memberVkId: item.toString()}})
        let bufferMembersLWrite = membersLeft.map(item => {return {bufMemberDomain: domain, bufMemberVkId: item.toString(), userChatId: secondUserChatId, action: 0}})
        await models.Member.destroy({where: {[Op.or]: membersLDestroy}})
        await models.bufferMember.bulkCreate(bufferMembersLWrite, {updateOnDuplicate: ["bufMemberDomain", "bufMemberVkId", "userChatId"]})
    }
}

export {findMembers, bufferManager}