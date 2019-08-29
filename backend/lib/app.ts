import * as express from 'express';
import * as mongoose from 'mongoose';
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const uuidv1 = require('uuid/v1');
require('dotenv').config();

// tests

import FccTestingRoute from './routes/FccTestingRoute';
import BoardsRoute from './routes/BoardsRoute';
import ThreadsRoute from './routes/ThreadsRoute';
import RepliesRoute from './routes/RepliesRoute';

interface sessionConfigType {
  secret: string;
  genid: () => string;
  cookie: { secure?: boolean };
  resave: boolean;
  saveUninitialized: boolean;
}

class App {
  public app: express.Application = express();
  private fccTestingRoute: FccTestingRoute = new FccTestingRoute();
  private boardsRoute: BoardsRoute = new BoardsRoute();
  private threadsRoute: ThreadsRoute = new ThreadsRoute();
  private repliesRoute: RepliesRoute = new RepliesRoute();
  private mongoSetup = (): void => {
    (<any>mongoose).Promise = global.Promise;
    mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    mongoose.set('useFindAndModify', false);
  };
  constructor() {
    this.app.use(bodyParser.json());
    this.app.use(cors({ optionSuccessStatus: 200, origin: '*' }));
    this.mongoSetup();
    this.app.use(helmet());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.xssFilter());
    // secure cookies with express-session
    const sessionConfig: sessionConfigType = {
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
    const staticPath = path.join(__dirname, '..', '..', 'frontend', 'public'); // change /public to /build on deploy
    const publicPath = path.join(
      __dirname,
      '..',
      '..',
      'frontend',
      'public',
      'index.html'
    );
    this.app.use(express.static(staticPath));
    this.app.get('/*', (_req, res) => res.sendFile(publicPath));
    //404 Not Found Middleware
    this.app.use((_req, res, _next) => {
      res
        .status(404)
        .type('text')
        .send('Not Found');
    });
  }
}

export default new App().app;
