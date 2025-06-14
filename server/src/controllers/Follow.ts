import { RequestHandler } from "express";
import mongoose from "mongoose";
import Follow from "../models/Follow";
import User from "../models/User";

// follow a author
export const followAuthor: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("");
    const author_username = req.params.author_username;
    const author = await User.findOne({ username: author_username });
    if (!author) {
      res.error(400, "error", "invalid request", null);
      return;
    }
    const exists = await Follow.exists({
      user_id: author._id,
      follower_id: userId,
    });
    if (exists) {
      res.error(400, "error", "Already following", null);
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
    res.error(500, "error", "Something went wrong", error);
  }
};

// unfollow a user
export const unfollowAuthor: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("");
    const author_username = req.params.author_username;
    const author = await User.findOne({ username: author_username });
    if (!author) {
      res.error(400, "error", "invalid request", null);
      return;
    }
    const follow = await Follow.findOne({
      user_id: author._id,
      follower_id: userId,
    });
    if (!follow) {
      res.error(400, "error", "invalid request", null);
      return;
    }
    await follow.deleteOne();
    res.success(200, "success", `Unfollowed ${author.username}`, null);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};

// get user followers
export const fetchAuthorFollowers: RequestHandler = async (req, res) => {
  try {
    const author_username = req.params.author_username;
    const author = await User.findOne({ username: author_username });
    if (!author) {
      res.error(400, "error", "invalid request", null);
      return;
    }
    const followers = await Follow.find({ user_id: author._id }).populate({
      path: "follower_id",
      select: "username fullname avatarURL -_id -__v",
    });
    res.success(200, "success", "Followers fetched", followers);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};
// get user following
export const fetchUserFollowing: RequestHandler = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("");
    const following = await Follow.find({ follower_id: userId }).populate({
      path: "user_id",
      select: "username fullname avatarURL -_id -__v",
    });
    res.success(200, "success", "following fetched fetched", following);
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
  }
};
