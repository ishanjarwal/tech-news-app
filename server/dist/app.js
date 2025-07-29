"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectDB_1 = __importDefault(require("./config/connectDB"));
const env_1 = require("./config/env");
require("./models"); // loads and registers all models once
const Admin_1 = __importDefault(require("./routes/Admin"));
const Category_1 = __importDefault(require("./routes/Category"));
const Comment_1 = __importDefault(require("./routes/Comment"));
const Like_1 = __importDefault(require("./routes/Like"));
const Post_1 = __importDefault(require("./routes/Post"));
const SubCategory_1 = __importDefault(require("./routes/SubCategory"));
const Tag_1 = __importDefault(require("./routes/Tag"));
const User_1 = __importDefault(require("./routes/User"));
const Follow_1 = __importDefault(require("./routes/Follow"));
const Homepage_1 = __importDefault(require("./routes/Homepage"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("./config/passport-jwt-strategy");
require("./config/passport-google-strategy");
require("./config/cloudinary");
const app = (0, express_1.default)();
(0, connectDB_1.default)();
// middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// init passport auth
app.use(passport_1.default.initialize());
app.use((0, cors_1.default)({ origin: env_1.env.FRONTEND_HOST, credentials: true }));
// routes
app.use("/api/v1/post", Post_1.default);
app.use("/api/v1/category", Category_1.default);
app.use("/api/v1/subcategory", SubCategory_1.default);
app.use("/api/v1/tag", Tag_1.default);
app.use("/api/v1/like", Like_1.default);
app.use("/api/v1/comment", Comment_1.default);
app.use("/api/v1/follow", Follow_1.default);
app.use("/api/v1/admin", Admin_1.default);
app.use("/api/v1/user", User_1.default);
app.use("/api/v1/homepage", Homepage_1.default);
app.listen(env_1.env.PORT, (error) => {
    if (error) {
        console.error("Something went wrong while starting the server\n", error);
    }
    else {
        console.log("Server running on port 8080");
    }
});
exports.default = app;
