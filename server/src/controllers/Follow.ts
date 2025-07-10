import { RequestHandler } from "express";
import mongoose from "mongoose";
import Follow from "../models/Follow";
import User, { UserValues } from "../models/User";

// follow a author
export const toggleFollow: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const author_username = req.params.author_username;
    const author = await User.findOne({ username: author_username });
    if (!author || userId.toString() === author._id.toString()) {
      res.error(400, "error", "invalid request", null);
      return;
    }
    const exists = await Follow.findOne({
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
    const newFollow = new Follow({
      user_id: author._id,
      follower_id: userId,
    });
    await newFollow.save();
    res.success(200, "success", `Following ${author.username}`, {
      action: "follow",
      username: author.username,
    });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// get author followers
export const fetchAuthorFollowers: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;

    const limit = 25; //  Fixed limit
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const skip = (page - 1) * limit;

    const followers = await Follow.aggregate([
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
    const totalCount = await Follow.countDocuments({ user_id: userId });
    res.success(200, "success", "Followers fetched", {
      followers: simplified,
      page: page,
      limit: limit,
      totalCount,
    });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// get user following
export const fetchUserFollowing: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error("Unauthenticated");
    const userId = user._id;

    const limit = 25; // Fixed limit
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const skip = (page - 1) * limit;

    const following = await Follow.aggregate([
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
    const totalCount = await Follow.countDocuments({ follower_id: userId });
    res.success(200, "success", "following fetched", {
      following: simplified,
      page: page,
      limit: limit,
      totalCount,
    });
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// remove follower
export const removeFollow: RequestHandler = async (req, res) => {
  try {
    const author = req.user as UserValues;
    if (!author) throw new Error("Unauthenticated");

    const authorId = author._id;
    const followerUsername = req.params.username;

    const follower = await User.findOne({ username: followerUsername });
    if (!follower || follower._id.toString() === authorId.toString()) {
      res.error(400, "error", "Invalid request", null);
      return;
    }

    const followEntry = await Follow.findOne({
      user_id: authorId, // author is being followed
      follower_id: follower._id, // follower to remove
    });

    if (!followEntry) {
      res.error(400, "error", "Invalid request", null);
      return;
    }

    await followEntry.deleteOne();

    res.success(
      200,
      "success",
      `Removed ${follower.username} from your followers`,
      {
        action: "removed",
        username: follower.username,
      }
    );
    return;
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};
