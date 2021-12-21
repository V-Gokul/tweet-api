const express = require("express");
const router = express.Router();
const tweetsServices = require("../services/tweet-services");
const { isLoggedIn, isOwnerId } = require("../middleware/auth");

router.post("/", isLoggedIn, async (req, res) => {
  const tweets = await tweetsServices.createTweets(
    Number(req.user.id),
    req.body
  );
  res.status(201).send(tweets);
  console.log("++++", tweets);
});

router.get("/", isLoggedIn, async (req, res) => {
  const tweets = await tweetsServices.getAllTweet(req.user.id);
  if (!tweets) {
    res.send({ message: "there is no tweets" });
  }
  res.status(201).send(tweets);
  console.log("$$$$", tweets);
});

router.get("/:id", isLoggedIn, isOwnerId, async (req, res) => {
  const tweet = await tweetsServices.getTweetsById(req.params.id);
  if (!tweet) {
    res.status(400).send({ message: "id not matched" });
  }
  res.status(200).send(tweet);
});
module.exports = router;
