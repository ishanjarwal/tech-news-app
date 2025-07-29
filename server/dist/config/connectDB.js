"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        const dbOptions = {
            dbName: "tech-news-app",
        };
        await mongoose_1.default.connect(env_1.env.DB_URL, dbOptions);
        console.log("connected to db");
    }
    catch (error) {
        console.log("error connecting to db server\n", error);
    }
};
exports.default = connectDB;
