import express from 'express';
import mongoose from 'mongoose';
const { connect } = mongoose;

import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import bodyparser from 'body-parser';

const { json, urlencoded } = bodyparser;

import { mongoURI, cookieKey } from './config/keys.mjs';
import { userRoutes } from './routes/userRoutes.js';
import { quoteRoutes } from './routes/quoteRoutes.js';
import { userAccountRoutes } from './routes/userAccountRoutes.js';

import './models/User.js';
import './models/Quote.js';
import './services/passport.js';
import Logger from './logger/logger.js';

connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });

const app = express();

app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [cookieKey]
  })
);

app.use('*', cors());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));
app.use(passport.initialize());
app.use(passport.session());

userRoutes(app);
quoteRoutes(app);
userAccountRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  Logger.info('<index: > - api started listen to portNumber : ' + PORT);
});
