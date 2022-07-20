import models from "./models/models.js";

async function findMembers(checkDomain) {
    const users = await models.Member.findAll({where: {memberDomain: checkDomain}});
    let oldMemberArray = [];
    for (let i = 0; i < users.length; i++) {
        oldMemberArray.push(parseInt(users[i].memberVkId))
    }
    return oldMemberArray
}

async function bufferManager(membersJoined, membersLeft, domain, secondUserChatId) {
    for (let i = 0; i < membersJoined.length; i++) {
        await models.Member.create({memberDomain: domain, memberVkId: membersJoined[i].toString()})
        if ((await models.bufferMember.findAll({
            where: {
                bufMemberDomain: domain,
                bufMemberVkId: membersJoined[i].toString(),
                userChatId: secondUserChatId
            }
        })).length === 0) {
            await models.bufferMember.create({
                bufMemberDomain: domain,
                bufMemberVkId: membersJoined[i].toString(),
                userChatId: secondUserChatId,
                action: 1
            })
        } else {
            await models.bufferMember.update({action: 1}, {where: {action: 0}})
        }

    }
    for (let j = 0; j < membersLeft.length; j++) {
        await models.Member.destroy({where: {memberDomain: domain, memberVkId: membersLeft[j].toString()}})
        if ((await models.bufferMember.findAll({
            where: {
                bufMemberDomain: domain,
                bufMemberVkId: membersLeft[j].toString(),
                userChatId: secondUserChatId
            }
        })).length === 0) {
            await models.bufferMember.create({
                bufMemberDomain: domain,
                bufMemberVkId: membersLeft[j].toString(),
                userChatId: secondUserChatId,
                action: 0
            })
        } else {
            await models.bufferMember.update({action: 0}, {where: {action: 1}})
        }
    }
}

export {findMembers, bufferManager}