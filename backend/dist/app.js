"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const uuidv1 = require('uuid/v1');
require('dotenv').config();
// tests
const FccTestingRoute_1 = require("./routes/FccTestingRoute");
const BoardsRoute_1 = require("./routes/BoardsRoute");
const ThreadsRoute_1 = require("./routes/ThreadsRoute");
const RepliesRoute_1 = require("./routes/RepliesRoute");
class App {
    constructor() {
        this.app = express();
        this.fccTestingRoute = new FccTestingRoute_1.default();
        this.boardsRoute = new BoardsRoute_1.default();
        this.threadsRoute = new ThreadsRoute_1.default();
        this.repliesRoute = new RepliesRoute_1.default();
        this.mongoSetup = () => {
            mongoose.Promise = global.Promise;
            mongoose.connect(process.env.MONGO_DB_URL, {
                useNewUrlParser: true,
                useCreateIndex: true
            });
            mongoose.set('useFindAndModify', false);
        };
        this.mongoSetup();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors({ origin: '*' }));
        this.app.use(helmet());
        this.app.use(helmet.noSniff());
        this.app.use(helmet.xssFilter());
        this.app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
        // secure cookies with express-session
        const sessionConfig = {
            secret: process.env.SECRET_KEY,
            genid: () => uuidv1(),
            cookie: {},
            resave: true,
            saveUninitialized: true
        };
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.enable('trust proxy');
        sessionConfig.cookie.secure = true; // serve secure cookies
        this.app.use(session(sessionConfig));
        this.fccTestingRoute.routes(this.app);
        this.boardsRoute.routes(this.app);
        this.threadsRoute.routes(this.app);
        this.repliesRoute.routes(this.app);
        // Serve any static files
        const static_path = path.join(__dirname, '..', '..', 'frontend', 'build'); // change /public to /build on deploy
        const public_path = path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html');
        this.app.use(express.static(static_path));
        this.app.get('/*', (_req, res) => res.sendFile(public_path));
        //404 Not Found Middleware
        this.app.use((_req, res, _next) => {
            res
                .status(404)
                .type('text')
                .send('Not Found');
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map