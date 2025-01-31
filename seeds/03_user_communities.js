import { v4 as uuidv4 } from "uuid";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
  // Clear existing data
  await knex("user_communities").del();

  // Fetch existing users and communities
  const users = await knex("users").select("id");
  const communities = await knex("communities").select("id");

  // Ensure we have enough users and communities
  if (users.length < 3 || communities.length < 3) {
    console.error("❌ Not enough users or communities exist!");
    return;
  }

  const userCommunities = [
    { user_id: users[0].id, community_id: communities[0].id },
    { user_id: users[0].id, community_id: communities[1].id },
    { user_id: users[0].id, community_id: communities[2].id },
    { user_id: users[1].id, community_id: communities[1].id },
    { user_id: users[1].id, community_id: communities[2].id },
    { user_id: users[2].id, community_id: communities[0].id },
    { user_id: users[2].id, community_id: communities[3].id },
  ];

  await knex("user_communities").insert(
    userCommunities.map((entry) => ({ id: uuidv4(), ...entry }))
  );

  console.log("✅ User-Community relationships seeded successfully!");
}
