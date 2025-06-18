import { RequestHandler } from "express";
import User from "../models/User";

// grant write privilleges to author
export const grantAuthorPrivilleges: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.error(404, "error", "User doesn't exist", null);
      return;
    }
    if (user.roles.includes("author")) {
      res.error(404, "error", "Author privilleges already granted", null);
      return;
    }
    user.roles = [...user.roles, "author"];
    await user.save();
    res.success(
      200,
      "success",
      `Author privilleges granted to ${user.fullname}`,
      null
    );
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};

// revoke author privilleges
export const revokeAuthorPrivilleges: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.error(404, "error", "User doesn't exist", null);
      return;
    }
    if (!user.roles.includes("author")) {
      res.error(404, "error", "Author privilleges not found", null);
      return;
    }
    user.roles = [...user.roles].filter((el) => el != "author");
    await user.save();
    res.success(
      200,
      "success",
      `Author privilleges revoked from ${user.fullname}`,
      null
    );
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
