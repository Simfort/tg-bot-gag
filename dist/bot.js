import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import checkForUpdates from "garden-grown-api";
dotenv.config();
const bot = new Telegraf(process.env.BOT_API_KEY);
bot.command("start", (ctx) => ctx.reply("hello"));
bot.command("stock", async (ctx) => {
    const data = await checkForUpdates();
    ctx.reply(JSON.stringify(data));
});
bot.launch();
