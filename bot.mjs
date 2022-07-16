import TeleBot from "telebot"
// const TeleBot = require('telebot')

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on('text', msg => msg.reply.text(msg.text))

export default bot
