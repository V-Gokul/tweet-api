const res = require("express/lib/response");
const knex = require("../db");

async function createTweets(id, { message }) {
  const tweets = {
    user_id: id,
    created_at: new Date(),
    updated_at: new Date(),
    message: message,
  };
  const [newId] = await knex("tweets").insert(tweets);
  tweets.id = newId;
  return tweets;
}

async function getAllTweet(id) {
  const AllTweets = await knex("tweets")
    .select("id", "message", "created_at", "updated_at")
    .where("user_id", id);
  if (!AllTweets) {
    return null;
  }
  return AllTweets;
}

async function getTweetsById(tweetId) {
  const tweet = await knex("tweets").select().where("id", tweetId).first();
  if (!tweet) {
    res.status(404).send({ mesage: "tweet id is not matched" });
  }
  return tweet;
}

async function deleteTweetById(id){
  const deleted = await getTweetsById(id);
if(!deleted){
  return res.send({mesage :"null"});
}
await knex("tweets").del().where("id",id);
return deleted;
}

module.exports = { createTweets, getAllTweet, getTweetsById, };
