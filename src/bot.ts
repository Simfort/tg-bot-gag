import { Bot } from "grammy";

const bot = new Bot("7451435139:AAE3BqurZ_nawgGEG3hFFjwifORKX7KTWjY");
bot.api.setMyCommands([
  { command: "start", description: "Начни бота" },
  { command: "/stock", description: "Узнай что за stock." },
]);

const text = `**Привет!** Это телеграмм бот создан для взаимодействия с режимом из роблокса под названием  вот команды для взаимодействия с игрой:
- /stock - Показывает все stocks в режимы.
`;

bot.command("start", async (ctx) => {
  await bot.api.sendMessage(ctx.chatId, text, {
    parse_mode: "Markdown",
    reply_markup: { force_reply: true },
  });
});

bot.command("stock", async (ctx) => {
  const res = await fetch("http://localhost:3000/api/stock");
  const data = await res.json();
  const format = await formatingStock(data);
  await bot.api.sendMessage(ctx.chatId, format);
});

bot.start();

interface SeedStock {
  name: string;
  image: string;
  value: number;
}

async function formatingStock(data: { seedsStock: SeedStock[] }) {
  let seedsStock = "Seed Stock";
  for (let i = 0; i < data.seedsStock.length; i++) {
    seedsStock += `\n - ${data.seedsStock[i].name} x${data.seedsStock[i].value}`;
  }

  return seedsStock;
}
