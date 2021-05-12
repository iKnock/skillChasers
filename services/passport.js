var passport = require("passport");
var passportJWT = require("passport-jwt");
var jwt = require("jsonwebtoken");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const keys = require('../config/keys');

const mongoose = require('mongoose');
const User = mongoose.model('User');

const app = () => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = keys.passportSecret;
  passport.use(
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
    jwt.verify(token, keys.passportSecret);
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

exports.app = app;
exports.isValidToken = isValidToken;
exports.retrieveToken = retrieveToken;