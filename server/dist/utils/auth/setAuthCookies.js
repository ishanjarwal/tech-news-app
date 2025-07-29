"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../config/env");
const setAuthCookies = (res, tokens) => {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, accessTokenExpiry: newAccessTokenExp, refreshTokenExpiry: newRefreshTokenExp, } = tokens;
    const accessTokenMaxAge = (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000; // in ms
    const refreshTokenmaxAge = (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000; // in ms
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: env_1.env.ENVIRONMENT === "production", // Set to true if using HTTPS
        maxAge: accessTokenMaxAge,
        sameSite: env_1.env.ENVIRONMENT === "production" ? "none" : "lax", // Adjust according to your requirements
    });
    // Set Cookie for Refresh Token
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: env_1.env.ENVIRONMENT === "production", // Set to true if using HTTPS
        maxAge: refreshTokenmaxAge,
        sameSite: env_1.env.ENVIRONMENT === "production" ? "none" : "lax", // Adjust according to your requirements
    });
};
exports.default = setAuthCookies;
