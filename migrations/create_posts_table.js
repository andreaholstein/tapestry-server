export async function up(knex) {
  await knex.schema.createTable("posts", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("post_id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .notNullable()
      .unique();
    table.text("post_text").notNullable();
    table.string("post_media");
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable("posts");
}
