"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateTokens_1 = __importDefault(require("./generateTokens"));
const User_1 = __importDefault(require("../../models/User"));
const verifyRefreshToken_1 = __importDefault(require("./verifyRefreshToken"));
const refreshTokens = async (req, res) => {
    try {
        // Verify if Refresh Token is valid
        const oldRefreshToken = req.cookies.refreshToken;
        const tokenDetails = await (0, verifyRefreshToken_1.default)(oldRefreshToken);
        // Find User based on Refresh Token detail id
        const user = await User_1.default.findById(tokenDetails.id);
        if (!user) {
            throw new Error("Unauthorized access");
        }
        // Generate new access and refresh tokens
        const { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry } = await (0, generateTokens_1.default)(user);
        return {
            newAccessToken: accessToken,
            newRefreshToken: refreshToken,
            newAccessTokenExp: accessTokenExpiry,
            newRefreshTokenExp: refreshTokenExpiry,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.default = refreshTokens;
