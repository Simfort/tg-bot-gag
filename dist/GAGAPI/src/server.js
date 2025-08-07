"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("./config.json"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const dashboard_1 = require("./dashboard");
const logger_1 = require("./logger");
const express_1 = __importDefault(require("express"));
let dashboard;
if (config_json_1.default.Dashboard) {
    dashboard = (0, dashboard_1.createDashboard)();
    (0, logger_1.setupLogger)(dashboard);
}
const app = (0, express_1.default)();
const PORT = config_json_1.default.Port || 3000;
app.use((0, cors_1.default)());
const activityLog = [];
function formatIP(ip) {
    if (typeof ip !== "string")
        return ip;
    if (ip.startsWith("192.168."))
        return ip;
    return ip;
}
function updateSettings() {
    if (config_json_1.default.Dashboard) {
        dashboard.settingsBox.setContent(`IP Whitelisting: ${config_json_1.default.IPWhitelist}\n` +
            `Whitelisted IPs: ${config_json_1.default.WhitelistedIPs.join(", ") || "None"}\n` +
            `Port: ${config_json_1.default.Port}`);
    }
}
function updateActivity() {
    if (config_json_1.default.Dashboard) {
        dashboard.activityBox.setContent(activityLog.join("\n"));
        dashboard.activityBox.setScrollPerc(100);
    }
}
function updatePerf() {
    const mem = process.memoryUsage();
    const usedMemMB = (mem.rss / 1024 / 1024).toFixed(2);
    const loadAvg = os_1.default.platform() === "win32" ? [0, 0, 0] : os_1.default.loadavg();
    const uptimeInSeconds = process.uptime();
    const days = Math.floor(uptimeInSeconds / (24 * 3600));
    const hours = Math.floor((uptimeInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);
    const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (config_json_1.default.Dashboard) {
        dashboard.perfBox.setContent(`{bold}RAM Usage:{/bold} ${usedMemMB} MB\n` +
            `{bold}CPU Load (1m, 5m, 15m):{/bold} ${loadAvg
                .map((v) => v.toFixed(2))
                .join(", ")}\n` +
            `{bold}Uptime:{/bold} ${uptime}`);
        dashboard.screen.render();
    }
    return {
        usedMemMB,
        loadAvg,
        uptime,
    };
}
function updateUI() {
    updateSettings();
    updateActivity();
    if (config_json_1.default.Dashboard) {
        dashboard.screen.render();
    }
}
console.log("🚀 Started Host");
if (config_json_1.default.IPWhitelist) {
    console.log(`IP Whitelisting ENABLED. Allowed IPs: ${config_json_1.default.WhitelistedIPs.join(", ") || "None"}`);
}
else {
    console.log(`IP Whitelisting DISABLED.`);
}
app.use((req, res, next) => {
    let rawIp;
    if (config_json_1.default.IPWhitelist) {
        rawIp = req.connection.remoteAddress || "";
    }
    else {
        rawIp =
            req.headers["x-forwarded-for"] ||
                req.headers["x-real-ip"] ||
                req.connection.remoteAddress ||
                "";
    }
    const ip = rawIp.includes("::ffff:") ? rawIp.split("::ffff:")[1] : rawIp;
    const timestamp = new Date().toISOString();
    const logEntry = (0, logger_1.formatLogEntry)(timestamp, req.method, req.originalUrl, formatIP(ip), !config_json_1.default.Dashboard);
    activityLog.push(logEntry);
    if (config_json_1.default.IPWhitelist && !config_json_1.default.WhitelistedIPs.includes(ip)) {
        console.log(`[403] Blocked IP: ${formatIP(ip)}`);
        updateUI();
        return res.status(403).json({ error: "Forbidden" });
    }
    console.log(logEntry);
    updateUI();
    next();
});
app.get("/status", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});
const routesDir = node_path_1.default.join(__dirname, "routes");
if (!node_fs_1.default.existsSync(routesDir))
    node_fs_1.default.mkdirSync(routesDir);
let loadCount = 0;
node_fs_1.default.readdir(routesDir, (err, files) => {
    if (err) {
        console.log(`Failed to read routes directory: ${err.message}`);
        return;
    }
    files.forEach((file) => {
        if (file.endsWith(".js")) {
            const routePath = node_path_1.default.join(routesDir, file);
            try {
                const routeModule = require(routePath);
                if (typeof routeModule.register === "function") {
                    routeModule.register(app);
                    console.log(`[Loader] Registered module: ${file}`);
                    loadCount++;
                }
                else {
                    console.log(`[Loader] No register() export in ${file}`);
                }
            }
            catch (error) {
                console.log(`[Loader] Error in ${file}: ${error.message}`);
            }
        }
    });
    app.listen(PORT, () => {
        console.log(`🚀 Server live at http://localhost:${PORT}`);
        console.log(`Available endpoints: GET /status`);
        console.log(`This GAG API is made by 3itx | https://github.com/just3itx | Add Credits if you wanna modify`);
        updateUI();
    });
});
setInterval(() => {
    updatePerf();
}, 1000);
process.on("uncaughtException", (err, origin) => {
    console.error(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
