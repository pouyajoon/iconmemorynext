"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressServer = void 0;
// otStore: SequelizeObjectTypeStore
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_sslify_1 = __importDefault(require("express-sslify"));
const fs_1 = require("fs");
const spdy = __importStar(require("spdy"));
// import * as core from "express-serve-static-core";
const path_1 = require("path");
const frontDistDir = (0, path_1.resolve)(__dirname, '/dist/front/');
function getServer(app) {
    const key = (0, fs_1.readFileSync)(`./cert/keys/server.key`, 'utf8');
    const cert = (0, fs_1.readFileSync)(`./cert/keys/server.crt`, 'utf8');
    const credentials = { key, cert, spdy: { plain: false } };
    return spdy.createServer(credentials, app);
}
function expressServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.static('dist/front'));
    app.use(express_1.default.urlencoded({ limit: '5mb', extended: true }));
    app.use(express_1.default.json({ limit: '5mb' }));
    app.use(express_sslify_1.default.HTTPS({ trustProtoHeader: true }));
    const port = process.env.PORT || 443;
    console.log("SETUP SERVER ON".blue, port, process.env.NODE_ENV, process.env.JUP_ENV);
    const server = getServer(app);
    app.get('*', function (req, res) {
        const r = (0, path_1.resolve)((0, path_1.join)(frontDistDir, 'index.html'));
        res.sendFile(r);
    });
    // app.get('/', (req, res) => {
    //     res.send({ ok: true });
    // })
    server.listen(port, () => console.debug(`🚀 icon memory ready with https on port ${port}!`.green));
    return { server, app };
    // const server = getServer(app);
}
exports.expressServer = expressServer;
//# sourceMappingURL=server.js.map