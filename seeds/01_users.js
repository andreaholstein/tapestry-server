/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const SALT_ROUNDS = 8;

export async function seed(knex) {
  await knex("users").del();

  const hashedPasswords = await Promise.all([
    bcrypt.hash("password123", SALT_ROUNDS),
    bcrypt.hash("securePass456", SALT_ROUNDS),
    bcrypt.hash("mySuperSecret789", SALT_ROUNDS),
  ]);

  await knex("users").insert([
    {
      id: uuidv4(),
      first_name: "John",
      last_name: "Doe",
      username: "john_doe",
      email: "john@example.com",
      password: hashedPasswords[0],
      profile_picture: "images/PROFILEPHOTO_1.jpg",
    },
    {
      id: uuidv4(),
      first_name: "Jane",
      last_name: "Smith",
      username: "jane_smith",
      email: "jane@example.com",
      password: hashedPasswords[1],
      profile_picture: "images/TRAVELPHOTO_9.jpg",
    },
    {
      id: uuidv4(),
      first_name: "Alice",
      last_name: "Brown",
      username: "alice_brown",
      email: "alice@example.com",
      password: hashedPasswords[2],
      profile_picture: "images/PROFILEPHOTO_6.jpg",
    },
  ]);
}
