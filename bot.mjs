import TeleBot from "telebot"
import sequelize from "./db.js"
import models from "./models/models.js";
import * as path from "path";
import * as Console from "console";
import {Op, where} from "sequelize";
import * as vk from "./vk.functions.mjs";
import * as bd from "./bd.functions.mjs";
import {
    commands,
    groupAlreadyConnected,
    groupLimited,
    groupNotExists, groupNotFound, groupsNotConnected, noChanges,
    startAnswer,
    startWrongAnswer
} from "./answers.mjs";


const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)
await sequelize.authenticate()
// await sequelize.sync()

async function makeResult(membersJoined, membersLeft, domain) {
    if (membersJoined.length === 0 && membersLeft.length === 0) return noChanges
    let message = ''
    for (let i = 0; i < membersLeft.length; i++) {
        message += 'https://vk.com/id' + membersLeft[i].toString() + ` - сбежал из https://vk.com/${domain}\n`;
    }
    for (let j = 0; j < membersJoined.length; j++) {
        message += 'https://vk.com/id' + membersJoined[j].toString() + ` - пришёл в https://vk.com/${domain}\n`;
    }
    return message
}

bot.on('/start', async msg => {
    try {
        const chatId = msg.chat.id
        await models.User.create({chatId})

        return msg.reply.text(startAnswer + commands)
    } catch (e) {
        return msg.reply.text(startWrongAnswer)
    }
})

bot.on(/^\/delete (.+)$/, async (msg, props) => {
    const text = props.match[1];
    const chatId = msg.chat.id
    if (await models.Domain.findOne({where: {domainId: text, userChatId: chatId}})) {
        const userCount = (await models.Domain.findAll({where: {domainId: text}})).length
        if (userCount === 2) {
            await models.bufferMember.destroy({where: {bufMemberDomain: text, userChatId: chatId}})
        } else {
            await models.Member.destroy({where: {memberDomain: text}})
        }
        await models.Domain.destroy({where: {domainId: text, userChatId: chatId}})
        return msg.reply.text(`Группа ${text} удалена)`)
    } else {
        return msg.reply.text(`Группа ${text} не подключена)`)
    }
})

bot.on('/bruh', async msg => {
})

bot.on(/^\/connect (.+)$/, async (msg, props) => {
    const text = props.match[1];
    const chatId = msg.chat.id
    if (!await vk.doesExists(text)) return msg.reply.text(groupNotExists)

    if (await models.Domain.findOne({where: {domainId: text, userChatId: chatId}})) {
        return msg.reply.text(groupAlreadyConnected)
    } else {
        const userCount = (await models.Domain.findAll({where: {domainId: text}})).length
        if (userCount !== 0) {
            if (userCount > 1) return msg.reply.text(`Группа ${text}` + groupLimited)
            let memberArray = await vk.connect(text);
            let oldMemberArray = await bd.findMembers(text)
            let membersJoined = memberArray.filter(x => !oldMemberArray.includes(x))
            let membersLeft = oldMemberArray.filter(x => !memberArray.includes(x))
            const secondUserChatId = (await models.Domain.findOne({
                where: {
                    domainId: text,
                    [Op.not]: [{userChatId: chatId}]
                }
            })).chatId
            await bd.bufferManager(membersJoined, membersLeft, text, secondUserChatId)

        } else {
            let members = await vk.connect(text)
            for (let i = 0; i < members.length; i++) {
                await models.Member.create({memberDomain: text, memberVkId: members[i].toString()})
            }
        }
        await models.Domain.create({domainId: text, userChatId: chatId})
        return msg.reply.text(`Группа ${text} подключена)`)
    }
});

bot.on('/info', async msg => {
    const chatId = msg.chat.id
    const rows = await models.Domain.findAll({where: {userChatId: chatId}});
    if (rows.length === 0) return msg.reply.text(groupsNotConnected);
    else {
        let message = 'Твои подключённые группы:\n'
        for (let i = 0; i < rows.length; i++) {
            message += `${i + 1} - https://vk.com/${rows[i].domainId}\n`;
        }
        return msg.reply.text(message);
    }
});

bot.on('/commands', async msg => {
    return msg.reply.text(commands);
});

bot.on(/^\/check (.+)$/, async (msg, props) => {
    const chatId = msg.chat.id
    const checkDomain = props.match[1];
    const domains = await models.Domain.findAll({where: {domainId: checkDomain}})
    let secondUserChatId = ''
    if (domains.length === 0) return msg.reply.text(groupNotFound)
    for (let i = 0; i < domains.length; i++) {
        if (domains[i].userChatId !== chatId.toString()) {
            secondUserChatId = domains[i].userChatId
        }
    }

    let memberArray = await vk.connect(checkDomain);
    let oldMemberArray = await bd.findMembers(checkDomain)
    let membersJoined = memberArray.filter(x => !oldMemberArray.includes(x))
    let membersLeft = oldMemberArray.filter(x => !memberArray.includes(x))
    if (secondUserChatId !== '') {
        await bd.bufferManager(membersJoined, membersLeft, checkDomain, secondUserChatId)
        let bufferUsers = await models.bufferMember.findAll({
            where: {
                bufMemberDomain: checkDomain,
                userChatId: chatId
            }
        });
        if (membersJoined.length === 0 && membersLeft.length === 0 && bufferUsers.length === 0) return msg.reply.text(noChanges)

        if (bufferUsers.length !== 0) {
            for (let i = 0; i < bufferUsers.length; i++) {
                if (bufferUsers[i].action === 1) {
                    membersJoined.push(parseInt(bufferUsers[i].bufMemberVkId))
                } else {
                    membersLeft.push(parseInt(bufferUsers[i].bufMemberVkId))
                }
            }
            await models.bufferMember.destroy({where: {bufMemberDomain: checkDomain, userChatId: chatId}});
        }
    }

    let message = await makeResult(membersJoined, membersLeft, checkDomain)
    return bot.sendMessage(msg.from.id, message);
})

bot.on('text', msg => {
    if (msg.text.startsWith('/start') || msg.text.startsWith('/connect') || msg.text.startsWith('/check') || msg.text.startsWith('/commands') || msg.text.startsWith('/info') || msg.text.startsWith('/delete')) return;
    return msg.reply.text('Я тебя не понимаю(');
})


export default bot
