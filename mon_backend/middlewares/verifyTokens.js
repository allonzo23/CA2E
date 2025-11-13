// middlewares/verifyToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ message: "Token manquant" });
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
   // const payload = jwt.verify(token, process.env.JWT_SECRET);
   const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
