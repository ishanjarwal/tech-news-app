"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const RefreshToken_1 = __importDefault(require("../../models/auth/RefreshToken"));
const generateTokens = async (user) => {
    try {
        const payload = {
            id: user._id,
            email: user.email,
            created_at: user.created_at,
        };
        const accessTokenExpiry = Math.floor(Date.now() / 1000) + 100; // 100 sec from now
        const refreshTokenExpiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days sec from now
        const accessToken = jsonwebtoken_1.default.sign({ ...payload, expiry: accessTokenExpiry }, env_1.env.JWT_ACCESS_TOKEN_SECRET
        //   { expiresIn: "100s" }
        );
        const refreshToken = jsonwebtoken_1.default.sign({ ...payload, expiry: refreshTokenExpiry }, env_1.env.JWT_REFRESH_TOKEN_SECRET
        //   { expiresIn: "7d" }
        );
        // remove the exising refreshtoken in db and add new one
        await RefreshToken_1.default.findOneAndUpdate({ user_id: user.id }, { token: refreshToken }, { upsert: true, new: true });
        return { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry };
    }
    catch (error) {
        throw error;
    }
};
exports.default = generateTokens;
