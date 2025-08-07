"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RESTOCK_CONFIG = {
    egg: { interval: 30 * 60 * 1000, format: "hms" },
    gear: { interval: 5 * 60 * 1000, format: "ms" },
    seeds: { interval: 5 * 60 * 1000, format: "ms" },
    cosmetic: { interval: 4 * 3600 * 1000, format: "hms" },
    SwarmEvent: { interval: 3600 * 1000, format: "hms" },
};
function pad(n) {
    return n < 10 ? "0" + n : n;
}
function calculateRestockTimes() {
    const now = new Date();
    const timezone = "America/New_York"; // or use Intl.DateTimeFormat().resolvedOptions().timeZone if preferred
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    function formatTime(timestamp) {
        return new Date(timestamp).toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: timezone,
        });
    }
    function timeSince(timestamp) {
        const nowMs = Date.now();
        const diff = nowMs - timestamp;
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60)
            return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60)
            return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    }
    function getResetTimes(interval) {
        const timeSinceStartOfDay = now.getTime() - today.getTime();
        const lastReset = today.getTime() + Math.floor(timeSinceStartOfDay / interval) * interval;
        const nextReset = today.getTime() + Math.ceil(timeSinceStartOfDay / interval) * interval;
        return { lastReset, nextReset };
    }
    const result = {};
    for (const [name, config] of Object.entries(RESTOCK_CONFIG)) {
        const { lastReset, nextReset } = getResetTimes(config.interval);
        const countdownMs = nextReset - now.getTime();
        let countdown;
        if (config.format === "hms") {
            countdown = `${pad(Math.floor(countdownMs / 3.6e6))}h ${pad(Math.floor((countdownMs % 3.6e6) / 6e4))}m ${pad(Math.floor((countdownMs % 6e4) / 1000))}s`;
        }
        else {
            // 'ms'
            countdown = `${pad(Math.floor(countdownMs / 6e4))}m ${pad(Math.floor((countdownMs % 6e4) / 1000))}s`;
        }
        result[name] = {
            timestamp: nextReset,
            countdown: countdown,
            LastRestock: formatTime(lastReset),
            timeSinceLastRestock: timeSince(lastReset),
        };
    }
    return result;
}
function register(app) {
    app.get("/api/stock/restock-time", (req, res) => {
        const restockTimes = calculateRestockTimes();
        res.json(restockTimes);
    });
}
exports.default = { register };
