"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isTokenExpired = (token) => {
    const decoded = jsonwebtoken_1.default.decode(token);
    if (decoded && typeof decoded != "string") {
        return decoded.expiry < Date.now() / 1000;
    }
    return true;
};
exports.default = isTokenExpired;
