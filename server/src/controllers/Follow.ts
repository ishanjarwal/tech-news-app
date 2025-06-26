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

// get author followers
export const fetchAuthorFollowers: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
    const followers = await Follow.aggregate([
      { $match: { user_id: userId } },
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
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const userId = user._id;
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
          "followedUser.avatar": 1,
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
