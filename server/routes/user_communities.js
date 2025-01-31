import { Router } from "express";
import initKnex from "knex";
import knexConfig from "../../knexfile.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const knex = initKnex(knexConfig);

// Get all user-community relationships
router.get("/", async (req, res) => {
  try {
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
      );

    res.status(200).json(userCommunities);
  } catch (error) {
    console.error("Error fetching user-communities:", error);
    res.status(500).json({ error: "Failed to fetch user-community data" });
  }
});

export default router;
