import { Router } from "express";
import initKnex from "knex";
import knexConfig from "../../knexfile.js";

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

export default router;
