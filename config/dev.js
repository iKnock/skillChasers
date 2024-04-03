require('dotenv').config();

module.exports = {
  logDirName: "skillchaserslog",
  mongoURI: "mongodb://localhost:27017/skillchasersdb",
  cookieKey: "cookieKey",
  passportSecret: "passDevSec",
  passportExpiresIn: 1000000
}

/*module.exports = {
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  passportSecret: process.env.PASSPORT_SECRET,
  passportExpiresIn: process.env.PASSPORT_EXPIRES_IN
}*/