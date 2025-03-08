// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
import { v4 as uuidv4 } from 'uuid';

export async function up(knex) {
  await knex.schema.createTable("users", function (table) {
    table.uuid('id').primary().defaultTo(knex.raw("(UUID())")); // Unique user ID
    table.string('first_name', 50).notNullable(); // First name
    table.string('last_name', 50).notNullable(); // Last name
    table.string("username", 50).notNullable().unique(); // Username (unique)
    table.string("email", 255).notNullable().unique(); // Email (unique)
    table.string("password", 255).notNullable(); // Hashed password
    table.string("profile_picture").defaultTo(null); // Optional profile picture URL
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("users");
}
