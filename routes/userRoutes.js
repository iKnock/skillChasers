import { verifyAccessToken } from '../middlewares/requireLogin.js';

import jwt from 'jsonwebtoken';
import * as keys from '../config/keys.mjs';
import bcrypt from 'bcrypt';
import util from 'util';

import User from '../models/User.js'

import Logger from '../logger/logger.js';

const hashAsync = util.promisify(bcrypt.hash);

const userRoutes = app => {

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

    async function hashPassword(password) {
        try {
            const hash = await hashAsync(password, 5);
            return hash;
        } catch (err) {
            Logger.info('<User Route: > - Error during password hashing - ' + err + ' - ' + req.ip);
            throw new Error("Error during password hashing");
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
        const user = await User.find({
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
        const user = await getUserByName(req.params.userName);
        Logger.info('<User Route: > - Read user by user name : ' + req.ip);
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

        try {
            account.password = await hashPassword(account.password);
            const userDb = await getUserByName(account.userName);

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

                // Sign token
                const token = jwt.sign({ userName: account.userName }, keys.passportSecret, {
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

export { userRoutes };