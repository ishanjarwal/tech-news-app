import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { env } from "../../config/env";
import RefreshToken from "../../models/auth/RefreshToken";
import { UserValues } from "../../models/User";

export interface TokenValues {
  accessToken: string;
  accessTokenExpiry: number;
  refreshToken: string;
  refreshTokenExpiry: number;
}

const generateTokens = async (
  user: UserValues & Document
): Promise<TokenValues> => {
  try {
    const payload = {
      id: user._id,
      email: user.email,
      created_at: user.created_at,
    };

    const accessTokenExpiry = Math.floor(Date.now() / 1000) + 100; // 100 sec from now
    const refreshTokenExpiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days sec from now

    const accessToken = jwt.sign(
      { ...payload, expiry: accessTokenExpiry },
      env.JWT_ACCESS_TOKEN_SECRET
      //   { expiresIn: "100s" }
    );
    const refreshToken = jwt.sign(
      { ...payload, expiry: refreshTokenExpiry },
      env.JWT_REFRESH_TOKEN_SECRET
      //   { expiresIn: "7d" }
    );

    // remove the exising refreshtoken in db and add new one
    await RefreshToken.findOneAndUpdate(
      { user_id: user.id },
      { token: refreshToken },
      { upsert: true, new: true }
    );

    return { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry };
  } catch (error) {
    throw error;
  }
};

export default generateTokens;
