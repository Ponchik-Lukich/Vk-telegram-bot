## Telegram bot for tracking subscribers in vk groups
After connecting to a certain group, it shows all subscribers who have left and joined it!

Commands:


/info - See your connected groups


/connect domain - add a group

/check domain - track subscribers

/delete доменное_имя_группы) - delete group

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPonomareVlad%2FTeleVercelBot&env=TELEGRAM_BOT_TOKEN&envDescription=Telegram%20Bot%20Token%20from%20%40BotFather&project-name=telegram-bot&repo-name=telegram-bot)

### Run locally

Install Vercel CLI

```bash
npm i -g vercel
```

Visit https://dashboard.ngrok.com/get-started/setup 

After downloading run ```ngrok http 3000``` and


replace```${host}``` on ```#####.ngrok.io```
in 
[api/setWebhook.mjs](api/setWebhook.mjs)

Then run local dev server 

```bash
npm run dev
```

Now you can make some changes in [bot.mjs](bot.mjs)

[Documentation for TeleBot](https://github.com/mullwar/telebot)

### Template structure:

- [api/telegram.mjs](api/telegram.mjs) — Endpoint function for WebHooks
- [api/setWebhook.mjs](api/setWebhook.mjs) — Function for setting WebHook URL
