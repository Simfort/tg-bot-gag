import { SeedStock, Stock } from "../types/types";

export async function formatingStock(data: Stock) {
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
}
