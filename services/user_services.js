// const { default: knex } = require("knex");
const knex = require("../db");

async function createUser(user) {
  user.created_at = new Date();
  user.updated_at = new Date();
  const [id] = await knex("users").insert(user);
  user.id = id;
  return user;
}
async function loginUser(userName, password) {
  const user = await knex("users")
    .select()
    .where({ userName, password })
    .first();
  return user;
}

async function getUserById(id) {
  return await knex("users")
    .select(["name", "userName", "mail_id", "DOB"])
    .where("id", id)
    .first();
}

async function updateUserById(id,user) {
  return await knex("users").update(user).where("id",id);
}
async function deleteUserById(id){
  return await knex("users").del().where("id",id);
}

module.exports = {
  createUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
