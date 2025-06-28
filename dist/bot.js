"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const bot = new grammy_1.Bot("7451435139:AAE3BqurZ_nawgGEG3hFFjwifORKX7KTWjY");
bot.api.setMyCommands([
    { command: "start", description: "Начни бота" },
    { command: "/stock", description: "Узнай что за stock." },
]);
const text = `**Привет!** Это телеграмм бот создан для взаимодействия с режимом из роблокса под названием  вот команды для взаимодействия с игрой:
- /stock - Показывает все stocks в режимы.
`;
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.sendMessage(ctx.chatId, text, {
        parse_mode: "Markdown",
        reply_markup: { force_reply: true },
    });
}));
bot.command("stock", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch("http://localhost:3000/api/stock");
    const data = yield res.json();
    const format = yield formatingStock(data);
    yield bot.api.sendMessage(ctx.chatId, format);
}));
bot.start();
function formatingStock(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let seedsStock = "Seed Stock";
        for (let i = 0; i < data.seedsStock.length; i++) {
            seedsStock += `\n - ${data.seedsStock[i].name} x${data.seedsStock[i].value}`;
        }
        return seedsStock;
    });
}
