const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const Logger = require('../logger/logger');

module.exports = {
  verifyAccessToken: (req, res, next) => {
    if (req.headers && req.headers.authorization) {
      const tokens = req.headers.authorization.split(' ');
      if (tokens && tokens.length === 2) {
        const jwtToken = tokens[1];
        try {
          jwt.verify(jwtToken, keys.passportSecret);
          next();
        } catch (error) {
          // error
          Logger.error('<middleware: > - ' + error.message + '-' + req.ip);
          return res.status(401).send({ status: "KO", error: 'Unauthorized, ' + error.message, payload: "{}" });
        }
      } else {
        Logger.error('<middleware: > - authorization header has wrong format' + req.ip);
        return res.status(401).send({ status: "KO", error: 'authorization header has wrong format', payload: "{}" });

      }
    } else {
      Logger.error('<middleware: > - authorization header not provided' + req.ip);
      return res.status(401).send({ status: "KO", error: 'Unauthorized, Provide valid Token!', payload: "{}" });
    }
  }
};
