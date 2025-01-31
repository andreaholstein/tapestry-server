import { v4 as uuidv4 } from "uuid";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export function up(knex) {
  return knex.schema.createTable("user_communities", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())")); // Auto-generate UUID
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("community_id")
      .notNullable()
      .references("id")
      .inTable("communities")
      .onDelete("CASCADE");
    table.timestamps(true, true);

    // Ensure unique combinations of user and community
    table.unique(["user_id", "community_id"]);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("user_communities");
}
