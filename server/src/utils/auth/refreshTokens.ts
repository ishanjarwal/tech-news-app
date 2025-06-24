import { Request, Response } from "express";
import generateTokens from "./generateTokens";
import User from "../../models/User";
import verifyRefreshToken from "./verifyRefreshToken";

const refreshTokens = async (req: Request, res: Response) => {
  try {
    // Verify if Refresh Token is valid
    const oldRefreshToken = req.cookies.refreshToken;
    const tokenDetails = await verifyRefreshToken(oldRefreshToken);

    // Find User based on Refresh Token detail id
    const user = await User.findById(tokenDetails.id);
    if (!user) {
      throw new Error("unauthorized access");
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry } =
      await generateTokens(user);

    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
      newAccessTokenExp: accessTokenExpiry,
      newRefreshTokenExp: refreshTokenExpiry,
    };
  } catch (error) {
    throw error;
  }
};

export default refreshTokens;
