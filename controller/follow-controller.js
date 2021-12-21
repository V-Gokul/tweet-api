const express = require("express");
const router = express.Router();
const followService = require("../services/follow-services");
const userService = require("../services/user_services");
const { isLoggedIn } = require("../middleware/auth");

router.post("/", isLoggedIn, async (req, res) => {
  const [id, followId] = [req.user.id, Number(req.body.follow_id)];
  if (!followId) {
    res.status(400).send({ code: 400, message: "follow_id field is missing" });
    return;
  }
  if (followId === id) {
    res.status(404).send({ code: 400, message: "User cannot follow himself" });
    return;
  }
  const user = await userService.getUserById(followId);
  if (!user) {
    res
      .status(400)
      .send({ code: 400, message: "Requested follower does not exists" });
    return;
  }
  try {
    const connectionId = await followService.createConnection(id, followId);
    res
      .status(201)
      .send({ id: connectionId, message: "Follow request sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ code: 400, message: "follow request failed" });
  }
});

router.get("/following", isLoggedIn, async (req, res) => {
  const followings = await followService.getFollowings(req.user.id);
  res.status(200).send(followings);
});

router.get("/following/:id", isLoggedIn, async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    res.status(400).send({ code: 400, message: "requested user not found" });
    return;
  }
  const following = await followService.getFollowings(req.params.id);
  res.status(200).send(following);
});

router.get("/followers", isLoggedIn, async (req, res) => {
  const followers = await followService.getFollowers(req.user.id);
  console.log("-----", followers);
  if (!followers) {
    res.send({ message: "no followers" });
    return;
  }
  res.status(200).send(followers);
});

router.get("/followers/:id", isLoggedIn, async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    res.status(400).send({ code: 400, message: "request user not found" });
    return;
  }
  const followers = await followService.getFollowers(req.params.id);
  res.status(200).send(followers);
});

router.delete("/delete/id", isLoggedIn, async (req, res) => {
  const deleted = await followService.deleteFollow(req.user.id, req.params.id);
  console.log("======", deleted);
  if (!deleted) {
    res
      .status(404)
      .status({ code: 404, message: "Requested unfollow cannot be processed" });
    return;
  }
  res.status(200).send({ code: 200, message: "Unfollowed sucessfuly" });
});

module.exports = router;
