"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFruit = void 0;
const { ItemData, Rarity, Mutations } = require("./FruitDatabase.js");
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function getFruitData(name) {
    return ItemData.find((item) => item.name === name) || null;
}
function calculateVariant(variantName) {
    const variant = Rarity.find((v) => v[0] === variantName);
    return variant ? variant[2] : 1;
}
function calculateMutation(tool) {
    if (!tool.attributes || !Array.isArray(tool.attributes))
        return 1;
    let mutationCount = 1;
    for (const attr of tool.attributes) {
        const mutation = Mutations[attr];
        if (mutation && typeof mutation.ValueMulti === "number") {
            mutationCount += mutation.ValueMulti - 1;
        }
    }
    return mutationCount;
}
function calculateFruit(tool) {
    var _a;
    if (!tool || typeof tool.Name !== "string") {
        console.warn("Invalid tool or missing Name.");
        return 0;
    }
    const itemData = getFruitData(tool.Name);
    if (!itemData) {
        console.warn(`No item data found for fruit: ${tool.Name}`);
        return 0;
    }
    if (typeof tool.Weight !== "object" ||
        typeof tool.Weight.value !== "number") {
        console.warn("Missing or invalid weight for the tool.");
        return 0;
    }
    const baseValue = itemData.baseValue;
    const weightDivisor = itemData.weightDivisor;
    const variantMultiplier = calculateVariant(((_a = tool.Variant) === null || _a === void 0 ? void 0 : _a.value) || "Normal");
    const mutationValue = calculateMutation(tool);
    const weightRatio = tool.Weight.value / weightDivisor;
    const clampedRatio = clamp(weightRatio, 0.95, 1e8);
    const finalValue = baseValue *
        mutationValue *
        variantMultiplier *
        (clampedRatio * clampedRatio);
    return Math.round(finalValue);
}
exports.calculateFruit = calculateFruit;
