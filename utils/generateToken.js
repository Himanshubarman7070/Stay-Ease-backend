import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "stayease_fallback_secret_change_in_prod";

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

export default generateToken;
