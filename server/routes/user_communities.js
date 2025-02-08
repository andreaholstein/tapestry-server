import { Router } from "express";
import initKnex from "knex";
import knexConfig from "../../knexfile.js";
import { v4 as uuidv4 } from "uuid";
import authorize from "../middleware/auth.js";
const router = Router();
const knex = initKnex(knexConfig);

// Get all user-community relationships
router.get("/", authorize, async (req, res) => {
  try {
    const userId = req.user_id; // Get user_id from decoded token [andrea updated to req.user_id]
    console.log("Authenticated user ID:", userId); // Log userId to verify

    // Fetch communities for the authenticated user
    const userCommunities = await knex("user_communities")
      .where("user_communities.user_id", userId)
      .join("communities", "user_communities.community_id", "communities.id")
      .select("communities.id", "communities.title");

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
