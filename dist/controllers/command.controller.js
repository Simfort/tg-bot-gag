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
exports.stockCommand = exports.startCommand = void 0;
const text = `**Привет!** Это телеграмм бот создан для взаимодействия с режимом из роблокса под названием  вот команды для взаимодействия с игрой:
- /stock - Показывает все stocks в режимы.
`;
const startCommand = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply(text, {
        parse_mode: "Markdown",
    });
});
exports.startCommand = startCommand;
const stockCommand = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch("https://gagapi-production.up.railway.app/stock");
    const data = yield res.json();
    console.log(data);
    yield ctx.reply(JSON.stringify(data));
});
exports.stockCommand = stockCommand;
