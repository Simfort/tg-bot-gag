import { CommandContext, Context } from "grammy";
import { formatingStock } from "../lib/formatingStock";

const text = `**Привет!** Это телеграмм бот создан для взаимодействия с режимом из роблокса под названием  вот команды для взаимодействия с игрой:
- /stock - Показывает все stocks в режимы.
`;

export const startCommand = async (ctx: CommandContext<Context>) => {
  await ctx.reply(text, {
    parse_mode: "Markdown",
  });
};
export const stockCommand = async (ctx: CommandContext<Context>) => {
  const res = await fetch("http://localhost:3000/api/stock");
  const data = await res.json();
  const format = await formatingStock(data);
  await ctx.reply(format, { parse_mode: "HTML" });
};
