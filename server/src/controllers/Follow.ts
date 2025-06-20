import { RequestHandler } from "express";
import mongoose from "mongoose";
import Follow from "../models/Follow";
import User from "../models/User";

// follow a author
export const toggleFollow: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b");
    const author_username = req.params.author_username;
    const author = await User.findOne({ username: author_username });
    if (!author || userId.equals(author?._id as mongoose.Types.ObjectId)) {
      res.error(400, "error", "invalid request", null);
      return;
    }
    const exists = await Follow.findOne({
      user_id: author._id,
      follower_id: userId,
    });
    if (exists) {
      await exists.deleteOne();
      res.success(200, "success", `Unfollowed ${author.username}`, null);
      return;
    }
    const newFollow = new Follow({
      user_id: author._id,
      follower_id: userId,
    });
    await newFollow.save();
    res.success(200, "success", `Following ${author.username}`, null);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// get user followers
export const fetchAuthorFollowers: RequestHandler = async (req, res) => {
  try {
    const authorId = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b"); // from req.user
    const followers = await Follow.aggregate([
      { $match: { user_id: authorId } },
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
          "follower.avatarURL": 1,
        },
      },
    ]);

    const simplified = followers.map((f) => f.follower);
    res.success(200, "success", "Followers fetched", simplified);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};

// get user following
export const fetchUserFollowing: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("6849905025c3c13ff2e36f6b"); // from req.user

    const following = await Follow.aggregate([
      { $match: { follower_id: userId } }, // user is following others
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
          "followedUser.avatarURL": 1,
        },
      },
    ]);

    const simplified = following.map((f) => f.followedUser);

    res.success(200, "success", "following fetched", simplified);
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
  }
};
