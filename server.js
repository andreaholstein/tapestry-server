import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
const { Server } = require("socket.io");

dotenv.config();
const app = express();

// Creating an HTTP server using an Express app
const server = http.createServer(app);

// Initialize Socket.io and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any origin (for development; pdate for production)
  },
});

// Enable CORS for all routes, parse JSON request bodies, and use PORT from .env
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware for logging requests
app.use((req, res, next) => {
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({ msg: "GET request working" });
});

// Import and mount posts routes
try {
  const postsRoutes = await import("./server/routes/posts.js");
  app.use("/posts", postsRoutes.default);
} catch (error) {
  console.error("[ERROR] Failed to import posts routes:", error);
}

// Import and mount community routes
try {
  const communityRoutes = await import("./server/routes/community.js");
  app.use("/communities", communityRoutes.default);
} catch (error) {
  console.error("[ERROR] Failed to import community routes:", error);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});

export default app;
