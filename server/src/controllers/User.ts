import { RequestHandler } from "express";
import mongoose from "mongoose";
import { genericMailSender } from "../utils/genericMailSender";
import { env } from "../config/env";

// request author privilleges
export const requestAuthorPrivilleges: RequestHandler = async (req, res) => {
  try {
    const user = {
      // _id: new mongoose.Types.ObjectId(""),
      email: "ishucodes@gmail.com",
      username: "johndoe",
    }; // from req.user
    await genericMailSender({
      to: env.EMAIL_FROM,
      from: user.email,
      subject: "Request for Author Privilleges",
      html: `<p>Username : ${user.username} </br>email : ${user.email}</br>Message : "Request to grant Author privilleges</p>`,
    });
    res.success(200, "success", "Request sent, you'll be notified soon", null);
  } catch (error) {
    console.log(error);
    res.error(200, "error", "Something went wrong", error);
  }
};
