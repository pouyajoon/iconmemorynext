// otStore: SequelizeObjectTypeStore
import cors from "cors";
import express from "express";
import enforce from "express-sslify";
import { readFileSync } from "fs";
import * as spdy from 'spdy';
// import * as core from "express-serve-static-core";
import { join, resolve } from "path";

const frontDistDir = 'dist/front';

function getServer(app: express.Application) {
    const key = readFileSync(`./cert/keys/server.key`, 'utf8');
    const cert = readFileSync(`./cert/keys/server.crt`, 'utf8');
    const credentials: spdy.server.ServerOptions = { key, cert, spdy: { plain: false } };
    return spdy.createServer(credentials, app);
}

export function expressServer() {
    const app = express();
    app.use(cors());
    app.use(express.static(frontDistDir));
    app.use(express.urlencoded({ limit: '5mb', extended: true }));
    app.use(express.json({ limit: '5mb' }));
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
    const port = process.env.PORT || 443;
    console.log("SETUP SERVER ON".blue, port, process.env.NODE_ENV, process.env.JUP_ENV);
    const server = getServer(app);

    app.get('*', function (req, res) {
        const r = resolve(join('dist/front', 'index.html'));
        res.sendFile(r);
    });

    // app.get('/', (req, res) => {
    //     res.send({ ok: true });
    // })

    server.listen(port, () => console.debug(`🚀 icon memory ready with https on port ${port}!`.green));
    return { server, app };
    // const server = getServer(app);
}
