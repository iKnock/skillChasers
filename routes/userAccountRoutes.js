const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const User = mongoose.model('User');

// import & configure logger
const Logger = require('../log/logger.js');
const morgan = require('morgan');

Logger.stream = {
    write: function (message, encoding) {
        Logger.info(message, encoding);
    },
};

module.exports = app => {

    //login user
    app.post('/api/skillChasers/user/login', async (req, res) => {
        Logger.info('Loggin called : ' + req.ip);
        try {
            const { userName, password } = req.body;
            const user = await User.findOne({ "account.userName": userName });
            if (user && user.account) {
                bcrypt.compare(password, user.account.password, function (err, isMatched) {
                    if (err) {
                        console.log("Error during unhasing: " + err)
                        res.status(500).json({ "status": "KO", "error": "Error during password unhashing", "payload": "{}" });
                    }

                    if (isMatched === true) {
                        // Sign token
                        const token = jwt.sign({ userName }, keys.passportSecret, {
                            expiresIn: 1000000,
                        });
                        const userToReturn = { ...user.toJSON(), ...{ token } };
                        //delete userToReturn.hashedPassword;
                        res.status(200).json({ "status": "OK", "error": "{}", "payload": { "token": token, "user name": user.account.userName, "role": user.role } });
                    } else {
                        console.log("Login Failed Password Error")
                        res.status(403).json({ "status": "KO", "error": "Login Failed, Wrong Password", "payload": "{}" });
                    }
                });

            } else {
                console.log("Login Failed Email Error")
                res.status(403).json({ "status": "KO", "error": "Login Failed, Wrong User Name", "payload": "{}" });
            }
        } catch (e) {
            console.log("Exception happen: " + e)
        }
    });
};
