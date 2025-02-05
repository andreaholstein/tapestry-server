import { v4 as uuidv4 } from "uuid";

export async function seed(knex) {
  await knex("communities").del();

  await knex("communities").insert([
    {
      id: uuidv4(),
      title: "Concerts",
      topic: "Music and Concerts",
      photo: "images/CONCERTPHOTO_1.jpg",
      alt_text: "A live concert stage",
    },
    {
      id: uuidv4(),
      title: "Coffeeshops",
      topic: "Cafes and Coffee Lovers",
      photo: "images/COFFEESHOP_1.jpg",
      alt_text: "A cozy coffee shop corner",
    },
    {
      id: uuidv4(),
      title: "Life Updates",
      topic: "Personal Life and Stories",
      photo: "images/LIFEUPDATESPHOTO_1.jpg",
      alt_text: "A person updating their blog",
    },
    {
      id: uuidv4(),
      title: "Web Developers",
      topic: "A community for web dev enthusiasts",
      photo: "images/CONCERTPHOTO_1.jpg",
      alt_text: "a photo of a laptop with code on it",
    },
  ]);
}
