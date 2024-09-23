const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydatabase.db");
db.close();

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./mydatabase.db",
  },
  useNullAsDefault: true,
});

function createTable() {
  return knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('age');
        table.string('gender');
      });
    }
  });
}

async function insert({ name, age, gender }) {
  try {
    const existingUser = await knex("users").where("name", name).first();

    if (existingUser) {
      console.log("User already exists");
    } else {
      await knex("users").insert({ name, age, gender });
      console.log("User inserted successfully");
    }
  } catch (err) {
    console.error("Error inserting user:", err);
  }
}

async function main() {
  try {
    await createTable();
    await insert({ name: "John", age: 30, gender: "male" });
    await insert({ name: "John", age: 30, gender: "male" });
  } catch (err) {
    console.error("Error:", err);
  } finally {
    knex.destroy();
  }
}

main();
