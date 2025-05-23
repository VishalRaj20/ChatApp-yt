import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log("Token received:", token); // move up
  
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT error:", err.message);
        return res.status(403).send("Token is not valid");
      }
      req.userId = decoded.userId;
      next();
    });
  };
  