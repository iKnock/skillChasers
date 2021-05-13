require('dotenv').config();
module.exports = {
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  passportSecret: process.env.PASSPORT_SECRET,
  passportExpiresIn: process.env.PASSPORT_EXPIRES_IN
}