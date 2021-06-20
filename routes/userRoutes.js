const { verifyAccessToken } = require('../middlewares/requireLogin');

const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Logger = require('../logger/logger');

module.exports = app => {

    async function getUserByName(userName) {
        Logger.info('userName : ' + userName);
        const user = await User.findOne({
            "account.userName": userName
        });
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    app.get('/', async (req, res) => {
        Logger.info('api : ' + req.ip);
        return res.status(200).json("The API is up and running. For usage refer the documentation");
    });

    app.get('/api/skillChasers/users/:id', verifyAccessToken, async (req, res) => {
        Logger.info('<User Route: > - Read user by id : ' + req.ip);
        const user = await User.findOne({
            _id: req.params.id
        });
        if (user) {
            res.status(200).json({ "status": "OK", "error": "{}", "payload": user });
        } else {
            res.status(404).json({ "status": "KO", "error": "User not found", "payload": "{}" });
        }

    });

    app.get('/api/skillChasers/users/skills/:skill', verifyAccessToken, async (req, res) => {
        Logger.info('<User Route: > - Read user by skills : ' + req.ip);
        const user = await User.findOne({
            "skills": req.params.skill
        });
        if (user) {
            res.status(200).json({ "status": "OK", "error": "{}", "payload": user });
        } else {
            res.status(404).json({ "status": "KO", "error": "Skill not found", "payload": "{}" });
        }

    });

    app.get('/api/skillChasers/users/name/:userName', verifyAccessToken, async (req, res) => {
        Logger.info('<User Route: > - Read user by user name : ' + req.ip);
        const user = await getUserByName(req.ip);
        if (user) {
            res.status(200).json({ "status": "OK", "error": "{}", "payload": user });
        } else {
            res.status(404).json({ "status": "KO", "error": "User not found", "payload": "{}" });
        }

    });

    app.get('/api/skillChasers/users', verifyAccessToken, async (req, res) => {
        Logger.info('<User Route: > - Read all users : ' + req.ip);
        const users = await User.find({});
        if (users) {
            res.status(200).json({ "status": "OK", "error": "{}", "payload": users });
        } else {
            res.status(404).json({ "status": "KO", "error": "User not found", "payload": "{}" });
        }
    });

    app.post('/api/skillChasers/register/users', async (req, res) => {
        Logger.info('<User Route: > - Register User : ' + req.ip);
        let { image, firstName, lastName, dateOfBirth, address, email, role, status, skills, projects, eduInfo, certificate, resource, account, createdOnDate } = req.body;

        //hash password
        bcrypt.hash(account.password, 5, (err, hash) => {
            if (err) {
                Logger.info('<User Route: > - Error during password hashing - ' + err + ' - ' + req.ip);
                res.status(500).json({ "status": "KO", "error": "Error during password hashing", "payload": "{}" });
            }
            account.password = hash
        });

        const uName = account.userName
        try {
            const userDb = await getUserByName(uName);
            if (!userDb) {

                const user = new User({
                    image,
                    firstName,
                    lastName,
                    dateOfBirth,
                    address,
                    email,
                    role,
                    status,
                    skills,
                    projects,
                    eduInfo,
                    certificate,
                    resource,
                    account,
                    createdOnDate
                });

                const savedUser = await user.save();

                res.status(200).json({ "status": "OK", "savedUser": savedUser });
                // Sign token
                const token = jwt.sign({ userName: uName }, keys.passportSecret, {
                    expiresIn: keys.passportExpiresIn,
                });
                const userToReturn = { ...savedUser.toJSON(), ...{ token } };
                //delete userToReturn.hashedPassword;
                res.status(200).json({ "status": "OK", "error": "{}", "payload": userToReturn });
            } else {
                Logger.info('<User Route: > - user already exists - ' + req.ip);
                res.status(403).json({ "status": "KO", "error": "User Name already exist", "payload": "{}" });
            }
        } catch (e) {
            Logger.error('<User Route: > - ' + e.message + '-' + req.ip);
            res.status(500).json({ "status": "KO", "error": e.message, "payload": "{}" });
            //generateServerErrorCode(res, 500, e, SOME_THING_WENT_WRONG);
        }
    });
};
