import jwt from 'jsonwebtoken';
import { config } from '../config/keys.mjs';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Logger from '../logger/logger.js';

const userAccountRoutes = app => {

    //login user
    app.post('/api/skillChasers/user/login', async (req, res) => {
        Logger.info('<User Account: > - Loggin called : ' + req.ip);
        try {
            const { userName, password } = req.body;
            const user = await User.findOne({ "account.userName": userName });
            if (user && user.account) {
                bcrypt.compare(password, user.account.password, function (err, isMatched) {
                    if (err) {
                        res.status(500).json({ "status": "KO", "error": "Error during password unhashing", "payload": "{}" });
                    }

                    if (isMatched === true) {
                        // Sign token
                        const token = jwt.sign({ userName }, config.passportSecret, {
                            expiresIn: config.passportExpiresIn,
                        });
                        const userToReturn = { ...user.toJSON(), ...{ token } };
                        //delete userToReturn.hashedPassword;
                        res.status(200).json({ "status": "OK", "error": "{}", "payload": { "token": token, "user name": user.account.userName, "role": user.role } });
                    } else {
                        Logger.info('<User Account: > - Login Failed Password Error ' + req.ip);
                        res.status(403).json({ "status": "KO", "error": "Login Failed, Wrong Password", "payload": "{}" });
                    }
                });

            } else {
                Logger.info('<User Account: > - Login Failed Email Error ' + req.ip);
                res.status(403).json({ "status": "KO", "error": "Login Failed, Wrong User Name", "payload": "{}" });
            }
        } catch (e) {
            Logger.info('<User Account: > - ' + e.message + '-' + req.ip);
        }
    });
};

export { userAccountRoutes };