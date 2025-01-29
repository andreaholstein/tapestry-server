import { v4 as uuidv4 } from "uuid";

export async function seed(knex) {
  await knex("posts").del();

  // Fetch communities and users
  const communities = await knex("communities").select("id");
  const users = await knex("users").select("id");

  // Check if users exist
  if (!users.length) {
    console.error("No users found in the database.");
    return;
  }

  const concertCommunityId = communities[0].id;
  const coffeeshopCommunityId = communities[1].id;
  const lifeUpdateCommunityId = communities[2].id;

  const userIds = users.map((user) => user.id);

  await knex("posts").insert([
    {
      id: uuidv4(),
      user_id: userIds[0], // Make sure this ID exists
      community_id: concertCommunityId,
      post_text: "Excited for the upcoming Coldplay concert! Who's going?",
      post_media: "./assets/images/CONCERTPHOTO_ (1).jpg",
    },
    {
      id: uuidv4(),
      user_id: userIds[2], // Make sure this ID exists
      community_id: concertCommunityId,
      post_text: "Just saw the Rolling Stones live. What a performance!",
      post_media: "./assets/images/CONCERTPHOTO_ (2).jpg",
    },

    // Posts for Coffeeshops Community
    {
      id: uuidv4(),
      user_id: userIds[1], // Make sure this ID exists
      community_id: coffeeshopCommunityId,
      post_text:
        "Found a great new coffee shop downtown. The best flat white ever!",
      post_media: "./assets/images/COFFESHOP_ (2).jpg",
    },
    {
      id: uuidv4(),
      user_id: userIds[2], // Make sure this ID exists
      community_id: coffeeshopCommunityId,
      post_text:
        "Coffee lovers unite! What's your go-to drink at your local café?",
      post_media: "./assets/images/COFFESHOP_ (1).jpg",
    },

    // Posts for Life Updates Community
    {
      id: uuidv4(),
      user_id: userIds[0], // Make sure this ID exists
      community_id: lifeUpdateCommunityId,
      post_text: "Just got engaged! Exciting times ahead.",
      post_media: "./assets/images/LIFEUPDATESPHOTO_(3).jpg",
    },
    {
      id: uuidv4(),
      user_id: userIds[1], // Make sure this ID exists
      community_id: lifeUpdateCommunityId,
      post_text:
        "Moving to a new city this week! Can’t wait for the adventure.",
      post_media: "./assets/images/LIFEUPDATESPHOTO_(2).jpg",
    },
  ]);
}
