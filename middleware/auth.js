const { default: knex } = require("knex");
const db = require("../db");

async function isLoggedIn(req, res, next) {
  req.user = req.session.user;
  if (req.user) {
    next();
    return;
  }

  res.status(401).send({ code: 401, message: "user Authentication failed" });
}
async function isOwnerId(req, res, next) {
  const isOwner = await knex("tweets")
    .select("tweets.*")
    .leftJoin("connections", "tweets.user_id", "=", "connections.connect_id")
    .where({ "tweets.id": req.params.id, "tweets.user_id": req.user.id })
    .orWhere({ "tweets.id": req.params.id, "connections.user_id": req.user.id })
    .first();
  
  if (isOwner) {
    next();
    return;
  }
  console.log("^^^^^", isOwner);
}
module.exports = { isLoggedIn, isOwnerId };
