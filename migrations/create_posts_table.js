export async function up(knex) {
  await knex.schema.createTable("posts", (table) => {
    table.uuid("id").primary(); // No default value here
    table.uuid("user_id").notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.uuid("community_id").nullable();
    table
      .foreign("community_id")
      .references("id")
      .inTable("communities")
      .onDelete("SET NULL");
    table.text("post_text").notNullable();
    table.string("post_media");
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable("posts");
}
