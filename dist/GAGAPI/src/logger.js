"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLogEntry = exports.setupLogger = void 0;
const config_json_1 = __importDefault(require("./config.json"));
let consoleBox, screen;
function formatLogEntry(timestamp, method, path, ip, useColors = true) {
    if (!useColors) {
        return `[${timestamp}] ${method} ${path} - ${ip}`;
    }
    const colors = {
        reset: "\x1b[0m",
        timestamp: "\x1b[38;5;15m",
        method: "\x1b[32m",
        path: "\x1b[33m",
        ip: "\x1b[36m",
    };
    return (`${colors.timestamp}[${timestamp}]${colors.reset} ` +
        `${colors.method}${method}${colors.reset} ` +
        `${colors.path}${path}${colors.reset} - ` +
        `${colors.ip}${ip}${colors.reset}`);
}
exports.formatLogEntry = formatLogEntry;
function setupLogger(dashboard) {
    consoleBox = dashboard.consoleBox;
    screen = dashboard.screen;
    const originalConsoleLog = console.log;
    console.log = function (...args) {
        const message = args
            .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
            .join(" ");
        if (config_json_1.default.Dashboard && consoleBox) {
            const timestamp = new Date().toISOString();
            const logEntry = formatLogEntry(timestamp, "LOG", message, "", true);
            consoleBox.insertBottom(logEntry);
            consoleBox.setScrollPerc(100);
            screen.render();
        }
        else {
            originalConsoleLog.apply(console, args);
        }
    };
    const originalConsoleError = console.error;
    console.error = function (...args) {
        const message = args
            .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
            .join(" ");
        if (config_json_1.default.Dashboard && consoleBox) {
            const timestamp = new Date().toISOString();
            const logEntry = formatLogEntry(timestamp, "ERROR", message, "", true);
            consoleBox.insertBottom(logEntry);
            consoleBox.setScrollPerc(100);
            screen.render();
        }
        else {
            originalConsoleError.apply(console, args);
        }
    };
}
exports.setupLogger = setupLogger;
