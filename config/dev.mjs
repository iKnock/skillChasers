import dotenv from 'dotenv';
dotenv.config();

export const logDirName = "skillchaserslog";
export const mongoURI = "mongodb://mongodb:27017/skillchasersdb";
//export const mongoURI = "mongodb://mongodb.default.svc.cluster.local:27017/skillchasersdb";
export const cookieKey = "cookieKey";
export const passportSecret = "passDevSec";
export const passportExpiresIn = 1000000;