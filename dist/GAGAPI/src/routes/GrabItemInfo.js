"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const DATA_FILE = path_1.default.join(__dirname, "..", "..", "data", "Database.json");
const options = {
    method: "GET",
    hostname: "growagarden.gg",
    port: null,
    path: "/api/v1/items/Gag/all?page=1&limit=1000000&sortBy=position",
    headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        priority: "u=1, i",
        referer: "https://growagarden.gg/values",
        "Content-Length": "0",
    },
};
let cachedData = null;
function fetchAndUpdateData() {
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, (res) => {
            const chunks = [];
            res.on("data", (chunk) => {
                chunks.push(chunk);
            });
            res.on("end", () => {
                try {
                    const body = Buffer.concat(chunks);
                    const jsonResponse = JSON.parse(body.toString());
                    delete jsonResponse.pagination;
                    if (jsonResponse.items && Array.isArray(jsonResponse.items)) {
                        jsonResponse.items.forEach((item) => {
                            delete item.id;
                            delete item.trend;
                        });
                    }
                    fs_1.default.writeFile(DATA_FILE, JSON.stringify(jsonResponse, null, 2), (err) => {
                        if (err) {
                            console.error("[Item-Info] Error writing to data file", err);
                            return reject(err);
                        }
                        cachedData = jsonResponse;
                        console.log(`[Item-Info] Database updated successfully`);
                        resolve("");
                    });
                }
                catch (parseErr) {
                    reject(parseErr);
                }
            });
        });
        req.on("error", (err) => {
            reject(err);
        });
        req.end();
    });
}
function loadCachedData() {
    try {
        if (fs_1.default.existsSync(DATA_FILE)) {
            const dataStr = fs_1.default.readFileSync(DATA_FILE, "utf-8");
            cachedData = JSON.parse(dataStr);
            console.log("[Item-Info] Loaded cached data from file");
        }
    }
    catch (err) {
        console.error("[Item-Info] Error loading cached data from file", err);
    }
}
function filterItems(items, filters) {
    return items.filter((item) => {
        const matchesCategory = filters.category
            ? item.category.toLowerCase() === filters.category.toLowerCase()
            : true;
        const matchesRarity = filters.rarity
            ? item.rarity.toLowerCase() === filters.rarity.toLowerCase()
            : true;
        const matchesName = filters.name
            ? item.name.toLowerCase().includes(filters.name.toLowerCase())
            : true;
        return matchesCategory && matchesRarity && matchesName;
    });
}
function register(app) {
    app.get("/api/item-info", (req, res) => {
        if (!cachedData || !cachedData.items) {
            return res.status(500).json({ error: "Item data not available" });
        }
        const filters = {
            category: req.query.filter || req.query.category,
            rarity: req.query.rarity,
            name: req.query.name,
        };
        const filtered = filterItems(cachedData.items, filters);
        res.json(filtered);
    });
}
fetchAndUpdateData().catch((err) => {
    console.error("[Item-Info] Initial data fetch failed, will use cached data if available:", err);
    loadCachedData();
});
exports.default = { register };
