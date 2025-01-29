import { Router } from "express";
import initKnex from "knex";
import knexConfig from "../../knexfile.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const knex = initKnex(knexConfig);

// GET route
router.get("/", async (req, res) => {
  try {
    const { community_id, user_id } = req.query;
    let postsQuery = knex("posts").select("*");

    if (community_id) {
      postsQuery = postsQuery.where("community_id", community_id);
    }
    if (user_id) {
      postsQuery = postsQuery.where("user_id", user_id);
    }

    const posts = await postsQuery;
    res.json(posts);
  } catch (err) {
    console.error("[ERROR] GET posts error:", err);
    res.status(500).json({ error: "An error occurred while fetching posts" });
  }
});

// POST route
router.post("/", async (req, res) => {
  try {
    const { post_text, post_media, user_id, community_id } = req.body;

    // Validate required fields
    if (!post_text || !user_id) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["post_text", "user_id"],
      });
    }

    // Create new post object with UUID
    const newPost = {
      id: uuidv4(),
      post_text,
      user_id,
      community_id: community_id || null, // community_id is nullable
      post_media: post_media || null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert the new post
    await knex("posts").insert(newPost);

    // Fetch the created post
    const createdPost = await knex("posts").where("id", newPost.id).first();

    res.status(201).json(createdPost);
  } catch (err) {
    console.error("[ERROR] POST posts error:", err);
    res.status(500).json({
      error: "An error occurred while creating the post",
      details: err.message,
    });
  }
});

export default router;
