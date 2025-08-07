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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const options = {
    method: "GET",
    hostname: "growagarden.gg",
    port: null,
    path: "/api/stock",
    headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        priority: "u=1, i",
        referer: "https://growagarden.gg/stocks",
        "trpc-accept": "application/json",
        "x-trpc-source": "gag",
    },
};
let cachedStockData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
function fetchStocks() {
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, (res) => {
            const chunks = [];
            res.on("data", (chunk) => {
                chunks.push(chunk);
            });
            res.on("end", () => {
                try {
                    const body = Buffer.concat(chunks);
                    const parsedData = JSON.parse(body.toString());
                    resolve(parsedData);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        req.on("error", (e) => {
            reject(e);
        });
        req.end();
    });
}
function formatItems(items, imageData, isLastSeen = false) {
    if (!Array.isArray(items) || items.length === 0)
        return [];
    return items.map((item) => {
        var _a, _b;
        const image = (imageData === null || imageData === void 0 ? void 0 : imageData[item.name]) || null;
        const baseItem = Object.assign({ name: (item === null || item === void 0 ? void 0 : item.name) || "Unknown" }, (image && { image }));
        if (isLastSeen) {
            return Object.assign(Object.assign({}, baseItem), { emoji: (item === null || item === void 0 ? void 0 : item.emoji) || "❓", seen: (_a = item === null || item === void 0 ? void 0 : item.seen) !== null && _a !== void 0 ? _a : null });
        }
        else {
            return Object.assign(Object.assign({}, baseItem), { value: (_b = item === null || item === void 0 ? void 0 : item.value) !== null && _b !== void 0 ? _b : null });
        }
    });
}
function formatStocks(stocks) {
    var _a, _b, _c, _d, _e;
    const imageData = stocks.imageData || {};
    return {
        easterStock: formatItems(stocks.easterStock, imageData),
        gearStock: formatItems(stocks.gearStock, imageData),
        eggStock: formatItems(stocks.eggStock, imageData),
        nightStock: formatItems(stocks.nightStock, imageData),
        honeyStock: formatItems(stocks.honeyStock, imageData),
        cosmeticsStock: formatItems(stocks.cosmeticsStock, imageData),
        seedsStock: formatItems(stocks.seedsStock, imageData),
        lastSeen: {
            Seeds: formatItems((_a = stocks.lastSeen) === null || _a === void 0 ? void 0 : _a.Seeds, imageData, true),
            Gears: formatItems((_b = stocks.lastSeen) === null || _b === void 0 ? void 0 : _b.Gears, imageData, true),
            Weather: formatItems((_c = stocks.lastSeen) === null || _c === void 0 ? void 0 : _c.Weather, imageData, true),
            Eggs: formatItems((_d = stocks.lastSeen) === null || _d === void 0 ? void 0 : _d.Eggs, imageData, true),
            Honey: formatItems((_e = stocks.lastSeen) === null || _e === void 0 ? void 0 : _e.Honey, imageData, true),
        },
        restockTimers: stocks.restockTimers || {},
    };
}
function fetchStockData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield fetchStocks();
            return formatStocks(data);
        }
        catch (err) {
            console.error("Error fetching stock data:", err);
            return null;
        }
    });
}
function register(app) {
    app.get("/api/stock", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const now = Date.now();
        if (cachedStockData && now - lastFetchTime < CACHE_DURATION) {
            return res.json(cachedStockData);
        }
        try {
            const stockData = yield fetchStockData();
            if (!stockData) {
                return res.status(500).json({ error: "Failed to fetch stock data" });
            }
            cachedStockData = stockData;
            lastFetchTime = now;
            res.json(stockData);
        }
        catch (err) {
            res.status(500).json({ error: "Error fetching stock data" });
        }
    }));
}
exports.default = { register };
