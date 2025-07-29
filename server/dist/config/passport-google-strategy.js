"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
const generateTokens_1 = __importDefault(require("../utils/auth/generateTokens"));
const sendGoogleAutogenPassword_1 = __importDefault(require("../utils/auth/sendGoogleAutogenPassword"));
const generateRandomString_1 = __importDefault(require("../utils/generateRandomString"));
const generateUsernameFromEmail_1 = require("../utils/generateUsernameFromEmail");
const env_1 = require("./env");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.env.GOOGLE_CLIENT_ID,
    clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        // console.log(profile);
        let user;
        user = await User_1.default.findOne({
            email: profile._json.email,
        });
        if (!user) {
            // if user not found, then register new user
            const { email, name, picture } = profile._json;
            const password = (0, generateRandomString_1.default)(8);
            const salt = await bcrypt_1.default.genSalt(env_1.env.SALT_ROUNDS);
            const hashedPassword = await bcrypt_1.default.hash(password, salt);
            let username;
            while (true) {
                username = (0, generateUsernameFromEmail_1.generateUsernameFromEmail)(email);
                const check = await User_1.default.findOne({ username });
                if (!check)
                    break;
            }
            user = await new User_1.default({
                username: username,
                fullname: name,
                email: email,
                password: hashedPassword,
                status: "active",
                login_provider: "google",
                preferences: {
                    language: "en-US",
                    theme: "light",
                    newsletter: false,
                },
            }).save();
            await (0, sendGoogleAutogenPassword_1.default)(email, name, password);
        }
        const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry, } = await (0, generateTokens_1.default)(user);
        return cb(null, {
            user,
            accessToken,
            accessTokenExpiry,
            refreshToken,
            refreshTokenExpiry,
        });
    }
    catch (error) {
        return cb(error);
    }
}));
