import bcrypt from "bcrypt";
import { Document } from "mongoose";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { UserValues } from "../models/User";
import generateTokens from "../utils/auth/generateTokens";
import sendGoogleAutogenPassword from "../utils/auth/sendGoogleAutogenPassword";
import generateRandomString from "../utils/generateRandomString";
import { generateUsernameFromEmail } from "../utils/generateUsernameFromEmail";
import { env } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // console.log(profile);
        let user: (UserValues & Document) | null;
        user = await User.findOne({
          email: profile._json.email,
        });

        if (!user) {
          // if user not found, then register new user
          const { email, name, picture } = profile._json;
          const password = generateRandomString(8);
          const salt = await bcrypt.genSalt(env.SALT_ROUNDS);
          const hashedPassword = await bcrypt.hash(password, salt);
          let username: string;
          while (true) {
            username = generateUsernameFromEmail(email as string);
            const check = await User.findOne({ username });
            if (!check) break;
          }
          user = await new User({
            username: username,
            fullname: name,
            email: email,
            password: hashedPassword,
            status: "active",
            login_provider: "google",
            preferences: {
              language: "en-US",
              theme: "light",
              newsletter: false,
            },
          }).save();
          await sendGoogleAutogenPassword(
            email as string,
            name as string,
            password
          );
        }

        const {
          accessToken,
          accessTokenExpiry,
          refreshToken,
          refreshTokenExpiry,
        } = await generateTokens(user as UserValues & Document);
        return cb(null, {
          user,
          accessToken,
          accessTokenExpiry,
          refreshToken,
          refreshTokenExpiry,
        });
      } catch (error) {
        return cb(error);
      }
    }
  )
);
