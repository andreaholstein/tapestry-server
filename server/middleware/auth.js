import jwt from "jsonwebtoken";

// Middleware to authorize users based on JWT
const authorize = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.token = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token verification failed" });
  }
};

export default authorize;
