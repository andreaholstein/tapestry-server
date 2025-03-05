import { Router } from "express";
import initKnex from "knex";
import knexConfig from "../../knexfile.js";
import { v4 as uuidv4 } from "uuid";
import authorize from "../middleware/auth.js";

const router = Router();
const knex = initKnex(knexConfig);

// GET community
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const community = await knex("communities").where("id", id).first();

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    res.json(community);
  } catch (err) {
    console.error("[ERROR] GET community error:", err);
    res.status(500).json({
      error: "An error occurred while fetching the community",
    });
  }
});

// Use verifyToken middleware to protect the route
router.post("/", authorize, async (req, res) => {
  try {
    const { title, topic, photo, alt_text } = req.body;

    // Defensive check: Ensure req.user exists
    if (!req.user || !req.user.id) {
      console.error(
        "[ERROR] POST create community: No user info found in req.user"
      );
      return res.status(401).json({ error: "User not authenticated" });
    }
    const user_id = req.user.id;

    if (!title || !topic || !photo || !alt_text) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new community
    const newCommunity = {
      id: uuidv4(),
      title: title,
      topic: topic,
      photo: photo,
      alt_text: alt_text,
    };

    // Insert the new community into the database
    await knex("communities").insert(newCommunity);

    // Retrieve the newly created community
    const community = await knex("communities")
      .where("id", newCommunity.id)
      .first();

    // Defensive check: Ensure the community was created successfully
    if (!community) {
      console.error(
        "[ERROR] POST create community: Community not found after insertion"
      );
      return res.status(500).json({ error: "Community creation failed" });
    }

    // Create a user-community relationship
    const userCommunity = {
      user_id: user_id,
      community_id: community.id,
    };

    // Insert the user-community relationship into the database
    await knex("user_communities").insert(userCommunity);

    res.status(201).json({
      message: "Community created successfully and user added.",
      community,
    });
  } catch (err) {
    console.error("[ERROR] POST create community error:", err.message);
    res.status(500).json({
      error: `An error occurred while creating the community and adding the user: ${err.message}`,
    });
  }
});

export default router;
