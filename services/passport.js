import passport from "passport";
const { use } = passport;

import { ExtractJwt as _ExtractJwt, Strategy as _Strategy } from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";
const { verify } = jsonwebtoken;

var ExtractJwt = _ExtractJwt;
var JwtStrategy = _Strategy;

import { passportSecret } from '../config/keys.mjs';

import mongoose from 'mongoose';
const { model } = mongoose;

const User = model('User');

const app = () => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = passportSecret;
  use(
    new Strategy(options, (payload, done) => {
      User.findOne({ "account.userName": payload.userName }, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          return done(null, {
            userName: user.account.userName,
            _id: user._id
          });
        }
        return done(null, false);
      });
    })
  );
};

/**
 * verify if token is valid
 * @param {*} token
 * @return {boolean}
 */
const isValidToken = (token) => {
  try {
    verify(token, passportSecret);
    return true;
  } catch (error) {
    // error
    return false;
  }
};

/**
 * retrieve token from header
 * @param {*} headers
 * @return {string} token or null
 */
const retrieveToken = (headers) => {
  if (headers && headers.authorization) {
    const tokens = headers.authorization.split(' ');
    if (tokens && tokens.length === 2) {
      return tokens[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const _app = app;
export { _app as app };
const _isValidToken = isValidToken;
export { _isValidToken as isValidToken };
const _retrieveToken = retrieveToken;
export { _retrieveToken as retrieveToken };