"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const MONGODB_URI = env_1.env.DB_URL;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
/**
 * Global is used here to maintain a cached connection across hot reloads in dev.
 * This prevents connections growing exponentially during API Route usage.
 */
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const dbOptions = {
            dbName: "tech-news-app",
            bufferCommands: false, // Important for serverless
            serverSelectionTimeoutMS: 5000,
        };
        cached.promise = mongoose_1.default
            .connect(MONGODB_URI, dbOptions)
            .then((mongoose) => {
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
        console.log("Connection to DB established");
    }
    catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
exports.default = connectDB;
