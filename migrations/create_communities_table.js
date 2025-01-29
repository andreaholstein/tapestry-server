export async function up(knex) {
  await knex.schema.createTable("communities", (table) => {
    table.uuid("id").primary(); // No default value here
    table.string("title").notNullable(); // Add title for the community
    table.string("topic").notNullable(); // Add topic for the community
    table.string("photo"); // Optional photo for the community
    table.string("alt_text"); // Optional alt text for the photo
    table.timestamps(true, true); // Create timestamps for created_at and updated_at
  });
}

export async function down(knex) {
  await knex.schema.dropTable("communities");
}
