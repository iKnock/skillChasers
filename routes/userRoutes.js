const { verifyAccessToken } = require('../middlewares/requireLogin');

const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = app => {

    async function getUserByName(userName) {
        console.log("getUserByName: " + userName)
        const user = await User.findOne({
            "account.userName": userName
        });
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    app.get('/api/skillChasers/users/:id', verifyAccessToken, async (req, res) => {
        const user = await User.findOne({
            _id: req.params.id
        });
        if (user) {
            res.status(200).json({ "status": "OK", "error": "{}", "payload": user });
        } else {
            res.status(404).json({ "status": "KO", "error": "User not found", "payload": "{}" });
        }

    });

    app.get('/api/skillChasers/users/name/:userName', verifyAccessToken, async (req, res) => {
        const user = await getUserByName(req.params.userName);
        if (user) {
            res.status(200).json({ "status": "OK", "error": "{}", "payload": user });
        } else {
            res.status(404).json({ "status": "KO", "error": "User not found", "payload": "{}" });
        }

    });

    app.get('/api/skillChasers/users', verifyAccessToken, async (req, res) => {
        const users = await User.find({});
        if (users) {
            res.status(200).json({ "status": "OK", "error": "{}", "payload": users });
        } else {
            res.status(404).json({ "status": "KO", "error": "User not found", "payload": "{}" });
        }
    });

    app.post('/api/skillChasers/register/users', async (req, res) => {
        let { name, dateOfBirth, address, email, role, status, skills, projects, eduInfo, certificate, resource, account, createdOnDate } = req.body;

        //hash password
        bcrypt.hash(account.password, 5, (err, hash) => {
            if (err) {
                res.status(500).json({ "status": "KO", "error": "Error during password hashing", "payload": "{}" });
            }
            account.password = hash
        });

        const uName = account.userName
        console.log("uName: " + uName)
        try {
            const userDb = await getUserByName(uName);
            if (!userDb) {

                const user = new User({
                    name,
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

                // Sign token
                const token = jwt.sign({ userName: uName }, keys.passportSecret, {
                    expiresIn: keys.passportExpiresIn,
                });
                const userToReturn = { ...savedUser.toJSON(), ...{ token } };
                //delete userToReturn.hashedPassword;
                res.status(200).json({ "status": "OK", "error": "{}", "payload": userToReturn });
            } else {
                console.log("user already exists")
                res.status(403).json({ "status": "KO", "error": "User Name already exist", "payload": "{}" });
            }
        } catch (e) {
            console.log("exception occured: " + e)
            res.status(500).json({ "status": "KO", "error": "Service unavailable", "payload": "{}" });
            //generateServerErrorCode(res, 500, e, SOME_THING_WENT_WRONG);
        }
    });
};
