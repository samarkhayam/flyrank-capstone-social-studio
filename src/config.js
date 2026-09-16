import "dotenv/config";
export const config={port:Number(process.env.PORT||3000),databaseFile:process.env.DATABASE_FILE||"./data/social-studio.db",telegramBotToken:process.env.TELEGRAM_BOT_TOKEN||"",telegramChatId:process.env.TELEGRAM_CHAT_ID||""};
