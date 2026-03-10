import jwt from "jsonwebtoken";

export const verifyTokenAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.accesstoken;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Token is not valid!" });

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated!" });
  }
};