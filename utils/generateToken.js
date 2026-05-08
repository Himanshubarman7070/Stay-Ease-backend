import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "stayease_fallback_secret_change_in_prod", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

export default generateToken;
