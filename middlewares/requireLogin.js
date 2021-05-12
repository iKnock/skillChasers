const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

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
          console.log("exception during token verification: " + error)
          return res.status(401).send({ status: "KO", error: 'Unauthorized, ' + error.message, payload: "{}" });
        }
      } else {
        console.log("authorization header has wrong format")
        return null;
      }
    } else {
      console.log("authorization header not provided: ")
      return res.status(401).send({ status: "KO", error: 'Unauthorized, Provide valid Token!', payload: "{}" });
    }
  }
};
