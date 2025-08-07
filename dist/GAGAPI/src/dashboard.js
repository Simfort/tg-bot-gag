"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDashboard = void 0;
const blessed_1 = __importDefault(require("blessed"));
function createDashboard() {
    const screen = blessed_1.default.screen({
        smartCSR: true,
        title: "GAG Dashboard | By 3itx",
    });
    const settingsBox = blessed_1.default.box({
        top: 0,
        left: "0%",
        width: "50%",
        height: "20%",
        tags: true,
        border: { type: "line" },
        style: { border: { fg: "cyan" } },
        label: " Settings ",
    });
    const perfBox = blessed_1.default.box({
        top: 0,
        left: "50%",
        width: "50%",
        height: "20%",
        tags: true,
        border: { type: "line" },
        style: { border: { fg: "magenta" } },
        label: " Performance ",
    });
    const activityBox = blessed_1.default.box({
        top: "20%",
        left: "0%",
        width: "100%",
        height: "60%",
        tags: true,
        border: { type: "line" },
        scrollable: true,
        alwaysScroll: true,
        style: { border: { fg: "green" } },
        label: " Activity ",
    });
    const consoleBox = blessed_1.default.box({
        bottom: 0,
        left: "center",
        width: "100%",
        height: "20%",
        tags: true,
        border: { type: "line" },
        scrollable: true,
        alwaysScroll: true,
        style: { border: { fg: "yellow" } },
        label: " Console ",
    });
    screen.append(settingsBox);
    screen.append(perfBox);
    screen.append(activityBox);
    screen.append(consoleBox);
    screen.key(["escape", "q", "C-c"], () => process.exit(0));
    screen.render();
    return { screen, settingsBox, perfBox, activityBox, consoleBox };
}
exports.createDashboard = createDashboard;
