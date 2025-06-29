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
exports.formatingStock = void 0;
function formatingStock(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(data);
        let seedsStock = "🌿Seed Stock";
        for (let i = 0; i < data.seedsStock.length; i++) {
            seedsStock += `\n <a href="${data.seedsStock[i].image}">- ${data.seedsStock[i].name}</a> x${data.seedsStock[i].value}`;
        }
        seedsStock += "\n ⚙️Gear Stock";
        for (let i = 0; i < data.gearStock.length; i++) {
            seedsStock += `\n <a href="${data.gearStock[i].image}">- ${data.gearStock[i].name}</a>  x${data.gearStock[i].value}`;
        }
        seedsStock += "\n 👕Cosmetics Stock";
        for (let i = 0; i < data.cosmeticsStock.length; i++) {
            seedsStock += `\n <a href="${data.cosmeticsStock[i].image}">- ${data.cosmeticsStock[i].name}</a>  x${data.cosmeticsStock[i].value}`;
        }
        seedsStock += "\n 🥚Egg Stock";
        for (let i = 0; i < data.eggStock.length; i++) {
            seedsStock += `\n <a href="${data.eggStock[i].image}">- ${data.eggStock[i].name}</a>  x${data.eggStock[i].value}`;
        }
        return seedsStock;
    });
}
exports.formatingStock = formatingStock;
