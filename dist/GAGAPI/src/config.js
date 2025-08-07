"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configPath = path_1.default.join(__dirname, "..", "config.json");
let config = {
    IPWhitelist: false,
    WhitelistedIPs: [],
    Dashboard: true,
    Port: 3000,
    UseGithubMutationData: true,
};
if (fs_1.default.existsSync(configPath)) {
    config = Object.assign(Object.assign({}, config), JSON.parse(fs_1.default.readFileSync(configPath, "utf8")));
}
else {
    fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Created config.json with default settings.`);
}
module.exports = config;
