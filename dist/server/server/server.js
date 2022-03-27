"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressServer = void 0;
// otStore: SequelizeObjectTypeStore
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_sslify_1 = __importDefault(require("express-sslify"));
const frontDistDir = '';
function expressServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.static(frontDistDir));
    app.use(express_1.default.urlencoded({ limit: '5mb', extended: true }));
    app.use(express_1.default.json({ limit: '5mb' }));
    // app.use(compression({ level: 1 }));
    app.use(express_sslify_1.default.HTTPS({ trustProtoHeader: true }));
    const port = process.env.PORT || 443;
    console.log("SETUP SERVER ON".blue, port, process.env.NODE_ENV, process.env.JUP_ENV);
    // const server = getServer(app);
}
exports.expressServer = expressServer;
//# sourceMappingURL=server.js.map