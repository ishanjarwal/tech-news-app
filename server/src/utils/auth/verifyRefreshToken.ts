import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import RefreshToken from "../../models/auth/RefreshToken";
import { env } from "../../config/env";

const verifyRefreshToken = async (token: string): Promise<JwtPayload> => {
  try {
    // Find the refresh token document
    const userRefreshToken = await RefreshToken.findOne({ token });
    if (!userRefreshToken) {
      throw new Error("unauthorized access : refresh token doc not found");
    }

    // Verify the refresh token and return the paylod
    const tokenDetails = jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET);
    return tokenDetails as JwtPayload;
  } catch (error: Error | JsonWebTokenError | any) {
    if (error instanceof JsonWebTokenError) {
      throw new Error("unauthorized access, couldn't verify token");
    }
    throw new Error(error.message);
  }
};

export default verifyRefreshToken;
