import jwt from "jsonwebtoken";
const isTokenExpired = (token: string) => {
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded != "string") {
    return decoded.expiry < Date.now() / 1000;
  }
  return true;
};

export default isTokenExpired;
