import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import PasswordResetToken from "../models/auth/PasswordResetToken";
import RefreshToken from "../models/auth/RefreshToken";
import Verification from "../models/auth/Verification";
import User, { UserValues } from "../models/User";
import generateTokens from "../utils/auth/generateTokens";
import sendOTP from "../utils/auth/sendOTP";
import sendPasswordResetEmailUtil from "../utils/auth/sendPasswordResetEmail";
import setAuthCookies from "../utils/auth/setAuthCookies";
import { genericMailSender } from "../utils/genericMailSender";
import cloudinary from "../config/cloudinary";
// User Registration
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // check for existing user
    const check = await User.findOne({ $or: [{ email }, { username }] });
    if (check) {
      res.error(400, "error", "User already exists", null);
      return;
    }

    // hash password and generate new user
    const salt = await bcrypt.genSalt(Number(Number(env.SALT_ROUNDS)));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      username,
      fullname,
      email,
      password: hashedPassword,
      login_provider: "email",
      roles: ["user"],
      status: "pending",
      preferences: { language: "en-US", newsletter: false, theme: "light" },
    }).save();

    const otp = await sendOTP(
      newUser.email as string,
      newUser.fullname as string
    );

    await new Verification({ user_id: newUser._id, otp }).save();

    res.success(200, "success", "Verification OTP sent to your email", {
      email: newUser.email,
    });
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// User Email verification
export const verifyEmail: RequestHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.error(400, "error", "No user found", null);
      return;
    }

    if (existingUser.status === "active") {
      res.success(200, "success", "Already verified", null);
      return;
    }

    const isVerified = await Verification.findOne({
      user_id: existingUser._id,
      otp,
    });
    if (!isVerified) {
      res.error(400, "error", "Invalid OTP", null);
      return;
    }

    if ((isVerified.expires_at as Date) < new Date()) {
      res.error(400, "error", "OTP Expired, Please resend the OTP", null);
      return;
    }

    existingUser.status = "active";
    await existingUser.save();
    await Verification.deleteMany({ user_id: existingUser._id });

    const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } =
      await generateTokens(existingUser);

    // set the cookies
    setAuthCookies(res, {
      accessToken,
      refreshToken,
      accessTokenExpiry,
      refreshTokenExpiry,
    });

    res.success(200, "success", "Verification successful", null);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// resend otp
export const resendOTP: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.error(400, "error", "No users exist", {});
      return;
    }

    if (existingUser.status === "active") {
      res.success(200, "success", "Account already verified", {});
      return;
    }

    const isVerified = await Verification.findOne({
      user_id: existingUser._id,
    });
    if (
      !isVerified ||
      isVerified.created_at < new Date(Date.now() - 2 * 60 * 1000)
    ) {
      await Verification.deleteMany({ userId: existingUser._id });
      const otp = await sendOTP(
        existingUser.email as string,
        existingUser.fullname as string
      );
      await new Verification({ user_id: existingUser._id, otp }).save();
      res.success(200, "success", "OTP sent", {});
      return;
    }
    res.error(400, "error", "Resend after 2 minutes", {});
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// User Login
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email_username, password } = req.body;
    const existing = await User.findOne({
      $or: [{ email: email_username }, { username: email_username }],
    });
    if (!existing) {
      res.error(400, "error", "invalid email/username or password", {});
      return;
    }
    const dec_password = await bcrypt.compare(password, existing.password);
    if (!dec_password) {
      res.error(400, "error", "invalid email/username or password", {});
      return;
    }
    if (existing.status !== "active") {
      res.error(400, "error", "Please verify your account", {});
      return;
    }

    // remove existing refresh token if any
    const existingRefreshToken = await RefreshToken.findOne({
      user_id: existing._id,
    });
    if (existingRefreshToken) await existingRefreshToken.deleteOne();

    // generate tokens and store it in db
    const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } =
      await generateTokens(existing);

    // set the cookies
    setAuthCookies(res, {
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
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// Change password
export const changeUserPassword: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) {
      throw new Error();
    }
    const existing = await User.findById(user._id);
    if (!existing) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    const { old_password, password } = req.body;
    const compare = await bcrypt.compare(old_password, existing.password);
    if (!compare) {
      res.error(400, "error", "Incorrect password", {});
      return;
    }

    const salt = await bcrypt.genSalt(Number(env.SALT_ROUNDS));
    const newPasswordHash = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(user._id, {
      $set: { password: newPasswordHash },
    });
    res.error(200, "success", "Password changed", null);
    return;
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// password reset email
export const sendPasswordResetEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.error(400, "error", "Invalid request", {});
      return;
    }

    const existingToken = await PasswordResetToken.findOne({
      user_id: user._id,
    });
    if (existingToken) {
      const createdAt = existingToken.created_at.getTime();
      const now = Date.now();
      // Prevent if less than 2 minutes have passed since last request
      if (now - createdAt < 2 * 60 * 1000) {
        res.error(
          400,
          "error",
          "Please wait 2 minutes before requesting another reset link",
          {}
        );
        return;
      } else {
        await existingToken.deleteOne();
      }
    }

    const payload = { user_id: user._id.toString(), email: user.email };
    const expiry = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes

    const token = jwt.sign(
      { ...payload, expiry },
      env.JWT_PASSWORD_RESET_SECRET
    );

    const newToken = new PasswordResetToken({
      user_id: user._id,
      token,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newToken.save();

    await sendPasswordResetEmailUtil(user.email, user.fullname, token);

    res.success(200, "success", "Password reset link sent to your email", null);
    return;
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// reset password
export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // validate token (in db and with jwt)
    const tokenDetails = jwt.verify(
      token,
      env.JWT_PASSWORD_RESET_SECRET
    ) as JwtPayload;
    if (tokenDetails.expiry < Math.floor(Date.now() / 1000)) {
      res.error(400, "error", "Link expired please send another link", {});
      return;
    }

    const user = await User.findById(tokenDetails.user_id);
    if (!user) {
      res.error(400, "error", "Invalid request", {});
      return;
    }

    const existingToken = await PasswordResetToken.findOne({
      user_id: user._id,
    });
    if (!existingToken) {
      res.error(400, "error", "Invalid request", {});
      return;
    }
    await PasswordResetToken.deleteMany({ user_id: user._id });

    const salt = await bcrypt.genSalt(Number(env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.success(200, "success", "Password reset successfully", {});
    return;
  } catch (error) {
    console.log(error);
    if (error instanceof JsonWebTokenError) {
      res.error(500, "error", "Invalid request, Please Try again", {});
    }
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// get User (used with a middleware always)
export const userProfile: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
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
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// Logout
export const logoutUser: RequestHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await RefreshToken.deleteMany({ token: refreshToken });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ status: "success", message: "Logged out" });
  } catch (error) {
    console.log(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) {
      throw new Error();
    }
    const {
      username,
      fullname,
      bio,
      github,
      linkedin,
      instagram,
      x,
      threads,
      websites,
      youtube,
      facebook,
      theme,
      language,
      newsletter,
    } = req.body;
    const preferences = {
      ...(theme && { theme }),
      ...(language && { language }),
      ...(newsletter != undefined && { newsletter }),
    };
    const roles = user.roles;
    let updates = {
      ...(username && { username }),
      ...(fullname && { fullname }),
      ...(bio && { bio }),
      ...(Object.keys(preferences).length > 0 && { preferences }),
    };
    if (roles.includes("author")) {
      const socialLinks = {
        ...(github && { github }),
        ...(x && { x }),
        ...(youtube && { youtube }),
        ...(instagram && { instagram }),
        ...(linkedin && { linkedin }),
        ...(threads && { threads }),
        ...(facebook && { facebook }),
        ...(websites && websites?.length > 0 && { websites }),
      };
      updates.socialLinks = socialLinks;
    }
    if (Object.keys(updates).length <= 0) {
      res.error(400, "warning", "Nothing to update", {});
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.success(200, "success", "Details updated", {});
    return;
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// upload profile picture
export const uploadProfilePicture: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const image = req.body.image;
    if (!image) throw new Error();
    if (user.avatar?.public_id) {
      const result = await cloudinary.uploader.destroy(user.avatar.public_id);
      if (result.result !== "ok") {
        res.error(400, "error", "Something went wrong while uploading", null);
        return;
      }
    }
    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          avatar: {
            public_id: image.public_id,
            format: image.format,
            url: image.url,
          },
        },
      },
      { new: true }
    );
    res.success(200, "success", "profile updated", { avatar: image.url });
    return;
  } catch (error) {
    if (req.body?.image?.public_id) {
      await cloudinary.uploader.destroy(req.body.image.public_id);
    }
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// upload cover image
export const uploadCoverImage: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    const image = req.body.image;
    if (!image) throw new Error();
    if (user.cover_image?.public_id) {
      const result = await cloudinary.uploader.destroy(
        user.cover_image.public_id
      );
      if (result.result !== "ok") {
        res.error(400, "error", "Something went wrong while uploading", null);
        return;
      }
    }
    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          cover_image: {
            public_id: image.public_id,
            format: image.format,
            url: image.url,
          },
        },
      },
      { new: true }
    );
    res.success(200, "success", "cover image updated", {
      cover_image: image.url,
    });
    return;
  } catch (error) {
    if (req.body?.image?.public_id) {
      await cloudinary.uploader.destroy(req.body.image.public_id);
    }
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// delete profile picture :
export const deleteProfilePicture: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    if (user.avatar?.public_id) {
      const result = await cloudinary.uploader.destroy(user.avatar.public_id);
      if (result.result !== "ok") {
        res.error(
          400,
          "error",
          "Something went wrong while removing picture",
          null
        );
        return;
      }
    }
    const updated = await User.findByIdAndUpdate(
      user._id,
      { $unset: { avatar: 1 } },
      { new: true }
    );
    res.success(200, "success", "profile picture removed", null);
    return;
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

// delete dover image :
export const deleteCoverImage: RequestHandler = async (req, res) => {
  try {
    const user = req.user as UserValues;
    if (!user) throw new Error();
    if (user.cover_image?.public_id) {
      const result = await cloudinary.uploader.destroy(
        user.cover_image.public_id
      );
      if (result.result !== "ok") {
        res.error(
          400,
          "error",
          "Something went wrong while removing image",
          null
        );
        return;
      }
    }
    const updated = await User.findByIdAndUpdate(
      user._id,
      { $unset: { cover_image: 1 } },
      { new: true }
    );
    res.success(200, "success", "cover image removed", null);
    return;
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
    return;
  }
};

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
    return;
  } catch (error) {
    console.log(error);
    res.error(200, "error", "Something went wrong", error);
  }
};
