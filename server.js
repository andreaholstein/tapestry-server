// index.js
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import userRoutes from "./server/routes/userRoutes.js"
import path from "path";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8081;
const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
  next();
});

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ msg: "GET request working" });
});

app.use("/users", userRoutes);

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
