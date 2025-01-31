import { v4 as uuidv4 } from "uuid";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
  // Clear existing data
  await knex("user_communities").del();

  // Fetch existing users and communities
  const users = await knex("users").select("id").limit(3);
  const communities = await knex("communities").select("id").limit(3);

  // Ensure we have enough users and communities
  if (users.length < 3 || communities.length < 3) {
    console.error("❌ Not enough users or communities exist!");
    return;
  }

  // Insert user-community relationships
  await knex("user_communities").insert([
    { id: uuidv4(), user_id: users[0].id, community_id: communities[0].id },
    { id: uuidv4(), user_id: users[1].id, community_id: communities[1].id },
    { id: uuidv4(), user_id: users[2].id, community_id: communities[2].id },
  ]);

  console.log("✅ User-Community relationships seeded successfully!");
}
