"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAuthors = exports.fetchAuthor = exports.requestAuthorPrivilleges = exports.deleteCoverImage = exports.deleteProfilePicture = exports.uploadCoverImage = exports.uploadProfilePicture = exports.updateUser = exports.logoutUser = exports.userProfile = exports.resetPassword = exports.sendPasswordResetEmail = exports.changeUserPassword = exports.loginUser = exports.resendOTP = exports.verifyEmail = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const env_1 = require("../config/env");
const PasswordResetToken_1 = __importDefault(require("../models/auth/PasswordResetToken"));
const RefreshToken_1 = __importDefault(require("../models/auth/RefreshToken"));
const Verification_1 = __importDefault(require("../models/auth/Verification"));
const User_1 = __importDefault(require("../models/User"));
const generateTokens_1 = __importDefault(require("../utils/auth/generateTokens"));
const sendOTP_1 = __importDefault(require("../utils/auth/sendOTP"));
const sendPasswordResetEmail_1 = __importDefault(require("../utils/auth/sendPasswordResetEmail"));
const setAuthCookies_1 = __importDefault(require("../utils/auth/setAuthCookies"));
const genericMailSender_1 = require("../utils/genericMailSender");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const Post_1 = __importDefault(require("../models/Post"));
const Like_1 = __importDefault(require("../models/Like"));
const Follow_1 = __importDefault(require("../models/Follow"));
const constants_1 = require("../constants/constants");
// User Registration
const createUser = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        // check for existing user
        const check = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (check) {
            res.error(400, "error", "User already exists", null);
            return;
        }
        // hash password and generate new user
        const salt = await bcrypt_1.default.genSalt(Number(Number(env_1.env.SALT_ROUNDS)));
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = await new User_1.default({
            username,
            fullname,
            email,
            password: hashedPassword,
            login_provider: "email",
            roles: ["user"],
            status: "pending",
            preferences: { language: "en-US", newsletter: false, theme: "light" },
        }).save();
        const otp = await (0, sendOTP_1.default)(newUser.email, newUser.fullname);
        await new Verification_1.default({ user_id: newUser._id, otp }).save();
        res.success(200, "success", "Verification OTP sent to your email", {
            email: newUser.email,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.createUser = createUser;
// User Email verification
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (!existingUser) {
            res.error(400, "error", "No user found", null);
            return;
        }
        if (existingUser.status === "active") {
            res.success(200, "success", "Already verified", null);
            return;
        }
        const isVerified = await Verification_1.default.findOne({
            user_id: existingUser._id,
            otp,
        });
        if (!isVerified) {
            res.error(400, "error", "Invalid OTP", null);
            return;
        }
        if (isVerified.expires_at < new Date()) {
            res.error(400, "error", "OTP Expired, Please resend the OTP", null);
            return;
        }
        existingUser.status = "active";
        await existingUser.save();
        await Verification_1.default.deleteMany({ user_id: existingUser._id });
        const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } = await (0, generateTokens_1.default)(existingUser);
        // set the cookies
        (0, setAuthCookies_1.default)(res, {
            accessToken,
            refreshToken,
            accessTokenExpiry,
            refreshTokenExpiry,
        });
        res.success(200, "success", "Verification successful", null);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.verifyEmail = verifyEmail;
// resend otp
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (!existingUser) {
            res.error(400, "error", "No users exist", {});
            return;
        }
        if (existingUser.status === "active") {
            res.success(200, "success", "Account already verified", {});
            return;
        }
        const isVerified = await Verification_1.default.findOne({
            user_id: existingUser._id,
        });
        if (!isVerified ||
            isVerified.created_at < new Date(Date.now() - 2 * 60 * 1000)) {
            await Verification_1.default.deleteMany({ userId: existingUser._id });
            const otp = await (0, sendOTP_1.default)(existingUser.email, existingUser.fullname);
            await new Verification_1.default({ user_id: existingUser._id, otp }).save();
            res.success(200, "success", "OTP sent", {});
            return;
        }
        res.error(400, "error", "Resend after 2 minutes", {});
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.resendOTP = resendOTP;
// User Login
const loginUser = async (req, res) => {
    try {
        const { email_username, password } = req.body;
        const existing = await User_1.default.findOne({
            $or: [{ email: email_username }, { username: email_username }],
        });
        if (!existing) {
            res.error(400, "error", "invalid email/username or password", {});
            return;
        }
        const dec_password = await bcrypt_1.default.compare(password, existing.password);
        if (!dec_password) {
            res.error(400, "error", "invalid email/username or password", {});
            return;
        }
        if (existing.status !== "active") {
            res.error(400, "error", "Please verify your account", {});
            return;
        }
        // remove existing refresh token if any
        const existingRefreshToken = await RefreshToken_1.default.findOne({
            user_id: existing._id,
        });
        if (existingRefreshToken)
            await existingRefreshToken.deleteOne();
        // generate tokens and store it in db
        const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } = await (0, generateTokens_1.default)(existing);
        // set the cookies
        (0, setAuthCookies_1.default)(res, {
            accessToken,
            refreshToken,
            accessTokenExpiry,
            refreshTokenExpiry,
        });
        res.success(200, "success", "logged in successfully", {
            id: existing._id,
            fullname: existing.fullname,
            email: existing.email,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.loginUser = loginUser;
// Change password
const changeUserPassword = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error();
        }
        const existing = await User_1.default.findById(user._id);
        if (!existing) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        const { old_password, password } = req.body;
        const compare = await bcrypt_1.default.compare(old_password, existing.password);
        if (!compare) {
            res.error(400, "error", "Incorrect password", {});
            return;
        }
        const salt = await bcrypt_1.default.genSalt(Number(env_1.env.SALT_ROUNDS));
        const newPasswordHash = await bcrypt_1.default.hash(password, salt);
        await User_1.default.findByIdAndUpdate(user._id, {
            $set: { password: newPasswordHash },
        });
        res.error(200, "success", "Password changed", null);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.changeUserPassword = changeUserPassword;
// password reset email
const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        const existingToken = await PasswordResetToken_1.default.findOne({
            user_id: user._id,
        });
        if (existingToken) {
            const createdAt = existingToken.created_at.getTime();
            const now = Date.now();
            // Prevent if less than 2 minutes have passed since last request
            if (now - createdAt < 2 * 60 * 1000) {
                res.error(400, "error", "Please wait 2 minutes before requesting another reset link", {});
                return;
            }
            else {
                await existingToken.deleteOne();
            }
        }
        const payload = { user_id: user._id.toString(), email: user.email };
        const expiry = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes
        const token = jsonwebtoken_1.default.sign({ ...payload, expiry }, env_1.env.JWT_PASSWORD_RESET_SECRET);
        const newToken = new PasswordResetToken_1.default({
            user_id: user._id,
            token,
            expires_at: new Date(Date.now() + 10 * 60 * 1000),
        });
        await newToken.save();
        await (0, sendPasswordResetEmail_1.default)(user.email, user.fullname, token);
        res.success(200, "success", "Password reset link sent to your email", null);
        return;
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
// reset password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        // validate token (in db and with jwt)
        const tokenDetails = jsonwebtoken_1.default.verify(token, env_1.env.JWT_PASSWORD_RESET_SECRET);
        if (tokenDetails.expiry < Math.floor(Date.now() / 1000)) {
            res.error(400, "error", "Link expired please send another link", {});
            return;
        }
        const user = await User_1.default.findById(tokenDetails.user_id);
        if (!user) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        const existingToken = await PasswordResetToken_1.default.findOne({
            user_id: user._id,
        });
        if (!existingToken) {
            res.error(400, "error", "Invalid request", {});
            return;
        }
        await PasswordResetToken_1.default.deleteMany({ user_id: user._id });
        const salt = await bcrypt_1.default.genSalt(Number(env_1.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        res.success(200, "success", "Password reset successfully", {});
        return;
    }
    catch (error) {
        console.log(error);
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.error(500, "error", "Invalid request, Please Try again", {});
        }
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.resetPassword = resetPassword;
// get User (used with a middleware always)
const userProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error();
        }
        const modifiled = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            username: user.username,
            login_provider: user.login_provider,
            roles: user.roles,
            socialLinks: user.socialLinks,
            preferences: user.preferences,
            status: user.status,
            creaetd_at: user.created_at,
            updated_at: user.updated_at,
            bio: user.bio,
            avatar: user.avatar?.url,
            cover_image: user.cover_image?.url,
        };
        res.success(200, "success", "User details fetched", modifiled);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.userProfile = userProfile;
// Logout
const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        await RefreshToken_1.default.deleteMany({ token: refreshToken });
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: env_1.env.ENVIRONMENT === "production", // Set to true if using HTTPS
            sameSite: env_1.env.ENVIRONMENT === "production" ? "none" : "lax",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env_1.env.ENVIRONMENT === "production", // Set to true if using HTTPS
            sameSite: env_1.env.ENVIRONMENT === "production" ? "none" : "lax",
        });
        res.status(200).json({ status: "success", message: "Logged out" });
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.logoutUser = logoutUser;
const updateUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.error(401, "error", "Unauthorized", {});
            return;
        }
        const { username, fullname, bio, github, linkedin, instagram, x, threads, websites, youtube, facebook, theme, language, newsletter, } = req.body;
        // Fetch full user to access existing preferences and socialLinks
        const existingUser = await User_1.default.findById(user._id).lean();
        if (!existingUser) {
            res.error(404, "error", "User not found", {});
            return;
        }
        const updates = {};
        // Basic fields
        if (username)
            updates.username = username;
        if (fullname)
            updates.fullname = fullname;
        if (bio)
            updates.bio = bio;
        // Merge preferences
        const newPreferences = {
            ...(theme !== undefined && { theme }),
            ...(language !== undefined && { language }),
            ...(newsletter !== undefined && { newsletter }),
        };
        if (Object.keys(newPreferences).length > 0) {
            updates.preferences = {
                ...existingUser.preferences,
                ...newPreferences,
            };
        }
        // Author-only: Merge socialLinks
        if (user.roles.includes("author")) {
            const newSocialLinks = {
                ...(github && { github }),
                ...(linkedin && { linkedin }),
                ...(instagram && { instagram }),
                ...(x && { x }),
                ...(threads && { threads }),
                ...(youtube && { youtube }),
                ...(facebook && { facebook }),
                ...(Array.isArray(websites) && websites.length > 0 && { websites }),
            };
            if (Object.keys(newSocialLinks).length > 0) {
                updates.socialLinks = {
                    ...(existingUser.socialLinks || {}),
                    ...newSocialLinks,
                };
            }
        }
        if (Object.keys(updates).length === 0) {
            res.error(400, "warning", "Nothing to update", {});
            return;
        }
        await User_1.default.findByIdAndUpdate(user._id, { $set: updates }, { new: true, runValidators: true });
        res.success(200, "success", "Details updated", {});
        return;
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.updateUser = updateUser;
// upload profile picture
const uploadProfilePicture = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const image = req.body.image;
        if (!image)
            throw new Error();
        if (user.avatar?.public_id) {
            const result = await cloudinary_1.default.uploader.destroy(user.avatar.public_id);
            if (result.result !== "ok") {
                res.error(400, "error", "Something went wrong while uploading", null);
                return;
            }
        }
        const updated = await User_1.default.findByIdAndUpdate(user._id, {
            $set: {
                avatar: {
                    public_id: image.public_id,
                    format: image.format,
                    url: image.url,
                },
            },
        }, { new: true });
        res.success(200, "success", "profile updated", { avatar: image.url });
        return;
    }
    catch (error) {
        if (req.body?.image?.public_id) {
            await cloudinary_1.default.uploader.destroy(req.body.image.public_id);
        }
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.uploadProfilePicture = uploadProfilePicture;
// upload cover image
const uploadCoverImage = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const image = req.body.image;
        if (!image)
            throw new Error();
        if (user.cover_image?.public_id) {
            const result = await cloudinary_1.default.uploader.destroy(user.cover_image.public_id);
            if (result.result !== "ok") {
                res.error(400, "error", "Something went wrong while uploading", null);
                return;
            }
        }
        const updated = await User_1.default.findByIdAndUpdate(user._id, {
            $set: {
                cover_image: {
                    public_id: image.public_id,
                    format: image.format,
                    url: image.url,
                },
            },
        }, { new: true });
        res.success(200, "success", "cover image updated", {
            cover_image: image.url,
        });
        return;
    }
    catch (error) {
        if (req.body?.image?.public_id) {
            await cloudinary_1.default.uploader.destroy(req.body.image.public_id);
        }
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.uploadCoverImage = uploadCoverImage;
// delete profile picture :
const deleteProfilePicture = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        if (user.avatar?.public_id) {
            const result = await cloudinary_1.default.uploader.destroy(user.avatar.public_id);
            if (result.result !== "ok") {
                res.error(400, "error", "Something went wrong while removing picture", null);
                return;
            }
        }
        const updated = await User_1.default.findByIdAndUpdate(user._id, { $unset: { avatar: 1 } }, { new: true });
        res.success(200, "success", "profile picture removed", null);
        return;
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.deleteProfilePicture = deleteProfilePicture;
// delete dover image :
const deleteCoverImage = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        if (user.cover_image?.public_id) {
            const result = await cloudinary_1.default.uploader.destroy(user.cover_image.public_id);
            if (result.result !== "ok") {
                res.error(400, "error", "Something went wrong while removing image", null);
                return;
            }
        }
        const updated = await User_1.default.findByIdAndUpdate(user._id, { $unset: { cover_image: 1 } }, { new: true });
        res.success(200, "success", "cover image removed", null);
        return;
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.deleteCoverImage = deleteCoverImage;
// request author privilleges
const requestAuthorPrivilleges = async (req, res) => {
    try {
        const user = {
            // _id: new mongoose.Types.ObjectId(""),
            email: "ishucodes@gmail.com",
            username: "johndoe",
        }; // from req.user
        await (0, genericMailSender_1.genericMailSender)({
            to: env_1.env.EMAIL_FROM,
            from: user.email,
            subject: "Request for Author Privilleges",
            html: `<p>Username : ${user.username} </br>email : ${user.email}</br>Message : "Request to grant Author privilleges</p>`,
        });
        res.success(200, "success", "Request sent, you'll be notified soon", null);
        return;
    }
    catch (error) {
        console.log(error);
        res.error(200, "error", "Something went wrong", error);
    }
};
exports.requestAuthorPrivilleges = requestAuthorPrivilleges;
// fetch author details
const fetchAuthor = async (req, res) => {
    try {
        const { username } = req.params;
        const author = await User_1.default.findOne({ username, roles: "author" }).select("-__v -login_provider -roles -preferences -email -password -updated_at -status");
        if (!author) {
            res.error(400, "error", "Invalid Request", null);
            return;
        }
        const authorId = author._id;
        console.log(authorId, typeof authorId);
        const [totalPosts, totalLikes, totalFollowers] = await Promise.all([
            Post_1.default.countDocuments({ author_id: authorId }),
            Like_1.default.countDocuments({
                post_id: {
                    $in: await Post_1.default.find({ author_id: authorId }).distinct("_id"),
                },
            }),
            Follow_1.default.countDocuments({ user_id: authorId }),
        ]);
        res.success(200, "success", "author fetched", {
            ...author.toObject(),
            avatar: author.avatar?.url,
            cover_image: author.cover_image?.url,
            totalPosts,
            totalLikes,
            totalFollowers,
        });
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", error);
    }
};
exports.fetchAuthor = fetchAuthor;
// fetch authors
const fetchAuthors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = constants_1.AUTHOR_LIMIT;
        const skip = (page - 1) * limit;
        const pipeline = [
            {
                $match: {
                    roles: "author",
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "author_id",
                    as: "authoredPosts",
                },
            },
            {
                $addFields: {
                    totalPosts: { $size: "$authoredPosts" },
                },
            },
            {
                $project: {
                    username: 1,
                    fullname: 1,
                    avatar: "$avatar.url",
                    bio: 1,
                    totalPosts: 1,
                },
            },
            { $sort: { totalPosts: -1 } },
            { $skip: skip },
            { $limit: limit },
        ];
        const authors = await User_1.default.aggregate(pipeline);
        const total = await User_1.default.countDocuments({ roles: "author" });
        res.success(200, "success", "Authors fetched", {
            authors,
            total,
            count: authors.length,
            page,
            limit,
        });
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", error);
    }
};
exports.fetchAuthors = fetchAuthors;
