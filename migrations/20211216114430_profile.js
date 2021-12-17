exports.up = function (knex) {
  return knex.schema.createTable("users", (t) => {
    t.increments();
    t.string("userName").notNullable().unique();
    t.string("password").notNullable().unique();
    t.string("name").notNullable();
    t.string("mail_id").notNullable().unique();
    t.string("DOB").notNullable();

    t.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
