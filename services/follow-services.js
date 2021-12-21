const db = require("../db");

async function createConnection(id, followId) {
  const [createdId] = await db("connections").insert({
    user_id: id,
    connect_id: followId,
  });
  return createdId;
}
async function getFollowings(id) {
  const following = await db("connections")
    .select(
      "users.name",
      "users.userName",
      "users.mail_id",
      "users.DOB",
      "users.id"
    )
    .leftJoin("users", "users.id", "=", "connections.connect_id")
    .where("connections.user_id", id);

  return following;
}
async function getFollowers(id) {
  const followers = await db("connections")
    .select(
      "users.name",
      "users.userName",
      "users.mail_id",
      "users.DOB",
      "users.id"
    )
    .leftJoin("users", "users.id", "=", "connections.user_id")
    .where("connections.connect_id", id);

  return followers;
}

async function deleteFollow(userId, connectId) {
  return await db("connections")
    .del()
    .where({ "user_id": userId, "connect_id": connectId });
}

module.exports = { createConnection, getFollowings, getFollowers,deleteFollow };
