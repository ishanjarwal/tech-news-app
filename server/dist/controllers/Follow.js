"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followStatus = exports.removeFollow = exports.fetchUserFollowing = exports.fetchAuthorFollowers = exports.toggleFollow = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Follow_1 = __importDefault(require("../models/Follow"));
const User_1 = __importDefault(require("../models/User"));
// follow a author
const toggleFollow = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const author_username = req.params.author_username;
        const author = await User_1.default.findOne({ username: author_username });
        if (!author || userId.toString() === author._id.toString()) {
            res.error(400, "error", "invalid request", null);
            return;
        }
        const exists = await Follow_1.default.findOne({
            user_id: author._id,
            follower_id: userId,
        });
        if (exists) {
            await exists.deleteOne();
            res.success(200, "success", `Unfollowed ${author.username}`, {
                action: "unfollow",
                username: author.username,
            });
            return;
        }
        const newFollow = new Follow_1.default({
            user_id: author._id,
            follower_id: userId,
        });
        await newFollow.save();
        res.success(200, "success", `Following ${author.username}`, {
            action: "follow",
            username: author.username,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.toggleFollow = toggleFollow;
// get author followers
const fetchAuthorFollowers = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const userId = user._id;
        const limit = 25; //  Fixed limit
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;
        const followers = await Follow_1.default.aggregate([
            { $match: { user_id: userId } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "follower_id",
                    foreignField: "_id",
                    as: "follower",
                },
            },
            { $unwind: "$follower" },
            {
                $project: {
                    _id: 0,
                    "follower.username": 1,
                    "follower.fullname": 1,
                    "follower.avatar": 1,
                },
            },
        ]);
        const simplified = followers.map((f) => f.follower);
        const totalCount = await Follow_1.default.countDocuments({ user_id: userId });
        res.success(200, "success", "Followers fetched", {
            followers: simplified,
            page: page,
            limit: limit,
            totalCount,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchAuthorFollowers = fetchAuthorFollowers;
// get user following
const fetchUserFollowing = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error("Unauthenticated");
        const userId = user._id;
        const limit = 25; // Fixed limit
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;
        const following = await Follow_1.default.aggregate([
            { $match: { follower_id: userId } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "followedUser",
                },
            },
            { $unwind: "$followedUser" },
            {
                $project: {
                    _id: 0,
                    "followedUser.username": 1,
                    "followedUser.fullname": 1,
                    "followedUser.avatar": 1,
                },
            },
        ]);
        const simplified = following.map((f) => f.followedUser);
        const totalCount = await Follow_1.default.countDocuments({ follower_id: userId });
        res.success(200, "success", "following fetched", {
            following: simplified,
            page: page,
            limit: limit,
            totalCount,
        });
    }
    catch (error) {
        console.log(error);
        res.error(500, "error", "Something went wrong", {});
    }
};
exports.fetchUserFollowing = fetchUserFollowing;
// remove follower
const removeFollow = async (req, res) => {
    try {
        const author = req.user;
        if (!author)
            throw new Error("Unauthenticated");
        const authorId = author._id;
        const followerUsername = req.params.username;
        const follower = await User_1.default.findOne({ username: followerUsername });
        if (!follower || follower._id.toString() === authorId.toString()) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        const followEntry = await Follow_1.default.findOne({
            user_id: authorId, // author is being followed
            follower_id: follower._id, // follower to remove
        });
        if (!followEntry) {
            res.error(400, "error", "Invalid request", null);
            return;
        }
        await followEntry.deleteOne();
        res.success(200, "success", `Removed ${follower.username} from your followers`, {
            action: "removed",
            username: follower.username,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.removeFollow = removeFollow;
const followStatus = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const author_id = new mongoose_1.default.Types.ObjectId(req.params.author_id);
        const relation = await Follow_1.default.findOne({
            user_id: author_id,
            follower_id: user._id,
        });
        if (relation) {
            res.success(200, "success", "", { follows: true });
            return;
        }
        res.success(200, "success", "", { follows: false });
        return;
    }
    catch (error) {
        console.error(error);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.followStatus = followStatus;
