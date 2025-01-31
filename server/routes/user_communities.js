import { Router } from "express";
import initKnex from "knex";
import knexConfig from "../../knexfile.js";
import { v4 as uuidv4 } from "uuid";
import authorize from "./authorize.js";
const router = Router();
const knex = initKnex(knexConfig);

// Get all user-community relationships
router.get("/", authorize, async (req, res) => {
  try {
    const userId = req.user_id; // Get user_id from decoded token

    const userCommunities = await knex("user_communities")
      .select(
        "user_communities.user_id",
        "user_communities.community_id",
        "users.username",
        "communities.title"
      )
      .join("users", "user_communities.user_id", "=", "users.id")
      .join(
        "communities",
        "user_communities.community_id",
        "=",
        "communities.id"
      )
      .where("user_communities.user_id", userId); // Filter by user ID

    if (userCommunities.length === 0) {
      return res
        .status(404)
        .json({ error: "No communities found for this user" });
    }

    res.status(200).json(userCommunities);
  } catch (error) {
    console.error("Error fetching user-communities:", error);
    res.status(500).json({ error: "Failed to fetch user-community data" });
  }
});

export default router;
