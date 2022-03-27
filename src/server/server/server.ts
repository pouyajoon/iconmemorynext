// otStore: SequelizeObjectTypeStore
import cors from "cors";
import express from "express";
import enforce from "express-sslify";

const frontDistDir = ''
export function expressServer() {
    const app = express();
    app.use(cors());
    app.use(express.static(frontDistDir));
    app.use(express.urlencoded({ limit: '5mb', extended: true }));
    app.use(express.json({ limit: '5mb' }));
    // app.use(compression({ level: 1 }));
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
    const port = process.env.PORT || 443;
    console.log("SETUP SERVER ON".blue, port, process.env.NODE_ENV, process.env.JUP_ENV);
    // const server = getServer(app);
}