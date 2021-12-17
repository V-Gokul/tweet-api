const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const usersServices = require("../services/user_services");

router.post("/register", async (req, res) => {
  let user = req.body;
  console.log("------>>>", user);
  try {
    const newUser = await usersServices.createUser(req.body);
    res.status(201).send(newUser,{ message: "registerd sucessfully" });
    // res.send({ message: "registerd sucessfully" });
  } catch (err) {
    if (err.errno === 19) {
      if (user.userName && user.mail_id) {
        res
          .status(400)
          .send({ code: 400, message: "username, email id already exists" });
        return;
      }
      if (user.mail_id) {
        res
          .status(400)
          .send({ code: 400, message: "Email id is already exist" });
        return;
      }
      if (user.userName) {
        res.status(400).send({ code: 400, message: "User name already exist" });
        return;
      } else {
        res.status(500).send({ code: 500, message: "Internal server error" });
      }
    }
  }
});
router.post("/login", async (req, res) => {
  const user = await usersServices.loginUser(
    req.body.userName,
    req.body.password
  );
  if (user) {
    req.session.user = user;
    res.send({ message: "logged in sucessfully" });
    return;
  }
  res.status(401).send({ code: 400, message: "user not found" });
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const user = await usersServices.getUserById(Number(req.params.id));
  if (!user) {
    res.status(404).send({ code: 404, message: "user not found" });
    return;
  }
  res.send(user);
});

router.put("/:id", isLoggedIn, async (req, res) => {
  const user = req.body;
  try {
    let updateData = {};
    if (user.name) updateData.name = user.name;
    if (user.mail_id) updateData.mail_id = user.mail_id;
    if (user.userName) updateData.userName = user.userName;
    if (user.DOB) updateData.DOB = user.DOB;
    updateData.updated_at = new Date();
    await usersServices.updateUserById(req.user.id, updateData);
    res.status(200).send(await usersServices.getUserById(req.user.id));
  } catch {
    if (err.errno === 19) {
      if (user.userName && user.mail_id) {
        res.status(400).send({
          code: 400,
          message: "Username and Email id is already exist",
        });
        return;
      }
      if (user.mail_id) {
        res
          .status(400)
          .send({ code: 400, message: "Email id is already exist" });
        return;
      }
      if (user.userName) {
        res
          .status(400)
          .send({ code: 400, message: "User name is already exist" });
        return;
      } else {
        res.status(500).send({ code: 500, message: "Internal server error" });
      }
    }
  }
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const deleted = await usersServices.deleteUserById(req.user.id);
  if (deleted) {
    req.session.user = null;
    req.user = null;
    res.status(202).send({ code: 202, message: "Account deleted sucessfully" });
    return;
  }
  res.status(500).send("Internal server error22");
});
module.exports = router;
