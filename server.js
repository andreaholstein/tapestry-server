import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import userRoutes from "./server/routes/userRoutes.js";
import userCommunitiesRoutes from "./server/routes/user_communities.js";
import communityRoutes from "./server/routes/community.js";
import postsRoutes from "./server/routes/posts.js"; // ✅ Import posts.js
import path from "path";
const { Server } = require("socket.io");

dotenv.config();
const app = express();

// Creating an HTTP server using an Express app
const server = http.createServer(app);

// Initialize Socket.io and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any origin (for development; update for production)
  },
});

// Enable CORS for all routes, parse JSON request bodies, and use PORT from .env
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

// Get current file's directory
const __dirname = path.resolve();
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Middleware for logging requests
app.use((req, res, next) => {
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({ msg: "GET request working" });
});

// ✅ Add missing posts route
app.use("/posts", postsRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/users", userRoutes);
app.use("/user-communities", userCommunitiesRoutes);
app.use("/communities", communityRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});

export default app;
