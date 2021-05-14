const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
require('./models/Quote');
require('./services/passport');

const Logger = require('./logger/logger');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });

const app = express();

app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use('*', cors());

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./routes/userRoutes')(app);
require('./routes/quoteRoutes')(app);
require('./routes/userAccountRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  Logger.info('<index: > - api started listen to portNumber : ' + PORT);
});
