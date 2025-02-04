import { Router } from "express";
import initKnex from "knex";
import knexConfig from "../../knexfile.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const knex = initKnex(knexConfig);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads", "posts");
fs.mkdirSync(uploadsDir, { recursive: true });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov/i;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images and videos are allowed!"));
  },
});

// GET route to fetch posts
router.get("/", async (req, res) => {
  try {
    const { community_id, user_id } = req.query;

    let postsQuery = knex("posts")
      .select(
        "posts.id",
        "posts.post_text",
        "posts.post_media",
        "posts.created_at",
        "posts.community_id",
        "users.email as user_email"
      )
      .leftJoin("users", "posts.user_id", "users.id")
      .orderBy("posts.created_at", "desc");

    if (community_id) {
      postsQuery = postsQuery.where("posts.community_id", community_id);
    }

    if (user_id) {
      postsQuery = postsQuery.where("posts.user_id", user_id);
    }

    const posts = await postsQuery;
    res.json(posts);
  } catch (err) {
    console.error("[ERROR] GET posts error:", err);
    res.status(500).json({
      error: "An error occurred while fetching posts",
      details: err.message,
    });
  }
});

// POST route to create a new post
router.post("/", upload.single("post_media"), async (req, res) => {
  try {
    const { post_text, user_id, community_id } = req.body;

    console.log("Received POST data:", {
      post_text,
      user_id,
      community_id,
      file: req.file,
    });

    // Validate required fields
    if (!post_text || !user_id) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["post_text", "user_id"],
      });
    }

    // Find the user's actual ID based on the email
    const user = await knex("users").where("email", user_id).first();

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        details: `No user found with email: ${user_id}`,
      });
    }

    // Verify community exists if community_id is provided
    if (community_id) {
      const community = await knex("communities")
        .where("id", community_id)
        .first();

      if (!community) {
        return res.status(404).json({
          error: "Community not found",
          details: `No community found with ID: ${community_id}`,
        });
      }
    }

    // Create new post object with UUID
    const newPost = {
      id: uuidv4(),
      post_text,
      user_id: user.id, // Use the actual user ID from the database
      community_id: community_id || null,
      post_media: req.file
        ? path.relative(process.cwd(), req.file.path).replace(/\\/g, "/")
        : null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert the new post
    await knex("posts").insert(newPost);

    // Fetch the created post with user email
    const createdPost = await knex("posts")
      .select(
        "posts.id",
        "posts.post_text",
        "posts.post_media",
        "posts.created_at",
        "posts.community_id",
        "users.email as user_email"
      )
      .leftJoin("users", "posts.user_id", "users.id")
      .where("posts.id", newPost.id)
      .first();

    res.status(201).json(createdPost);
  } catch (err) {
    console.error("[ERROR] POST posts error:", err);
    res.status(500).json({
      error: "An error occurred while creating the post",
      details: err.message,
      stack: err.stack,
    });
  }
});

// DELETE route to remove a post
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the post to get the media file path
    const post = await knex("posts").where("id", id).first();

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete the post from the database
    await knex("posts").where("id", id).del();

    // Remove the associated media file if it exists
    if (post.post_media) {
      const fullPath = path.join(process.cwd(), post.post_media);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("[ERROR] DELETE post error:", err);
    res.status(500).json({
      error: "An error occurred while deleting the post",
      details: err.message,
    });
  }
});

export default router;
