"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const server_1 = require("./server/server");
colors_1.default.setTheme({
    info: "green"
});
console.log('ok'.blue);
(0, server_1.expressServer)();
//# sourceMappingURL=index.js.map