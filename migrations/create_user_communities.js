import { v4 as uuidv4 } from "uuid";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export function up(knex) {
  return knex.schema.createTable("user_communities", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())")); // Unique row ID
    table.uuid("user_id").notNullable();
    table.uuid("community_id").notNullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("community_id")
      .references("id")
      .inTable("communities")
      .onDelete("CASCADE");

    table.timestamp("joined_at").defaultTo(knex.fn.now()); // Timestamp when user joined the community

    table.unique(["user_id", "community_id"]); // Prevent duplicate entries
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("user_communities");
}
