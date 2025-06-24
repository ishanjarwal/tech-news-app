import { Response } from "express";
import { TokenValues } from "./generateTokens";
import { env } from "../../config/env";

const setAuthCookies = (res: Response, tokens: TokenValues) => {
  const {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenExpiry: newAccessTokenExp,
    refreshTokenExpiry: newRefreshTokenExp,
  } = tokens;
  const accessTokenMaxAge =
    (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000; // in ms
  const refreshTokenmaxAge =
    (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000; // in ms

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: env.ENVIRONMENT === "production", // Set to true if using HTTPS
    maxAge: accessTokenMaxAge,
    sameSite: "none", // Adjust according to your requirements
  });

  // Set Cookie for Refresh Token
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: env.ENVIRONMENT === "production", // Set to true if using HTTPS
    maxAge: refreshTokenmaxAge,
    sameSite: "none", // Adjust according to your requirements
  });
};

export default setAuthCookies;
