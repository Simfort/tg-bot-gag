"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const command_controller_1 = require("./controllers/command.controller");
dotenv_1.default.config();
const bot = new grammy_1.Bot(process.env.BOT_API_KEY);
bot.api.setMyCommands([
    { command: "start", description: "Начни бота" },
    { command: "/stock", description: "Узнай что за stock." },
]);
bot.command("start", command_controller_1.startCommand);
bot.command("stock", command_controller_1.stockCommand);
bot.start();
