import { Bot } from "grammy";
import dotenv from "dotenv";
import { startCommand, stockCommand } from "./controllers/command.controller";

dotenv.config();
const bot = new Bot(process.env.BOT_API_KEY!);

bot.api.setMyCommands([
  { command: "start", description: "Начни бота" },
  { command: "/stock", description: "Узнай что за stock." },
]);

bot.command("start", startCommand);

bot.command("stock", stockCommand);

bot.start();
