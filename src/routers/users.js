const express = require("express");
const Users = require("../schema/usersSchema");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new Users(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/users", async (req, res) => {
  try {
    const foundUsers = await Users.find({});
    await res.status(200).res.send(foundUsers);
  } catch (err) {
    await res.status(500).res.send(err);
  }
});
router.get("/users/:id", async (req, res) => {
  try {
    const foundUser = await Users.findById({ _id: req.params.id });
    if (!foundUser) {
      res.status(404).send();
    }
    await res.status(200).send(foundUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  ); //Update allowed or not
  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid Updates!",
    });
  }

  const id = req.params.id;
  try {
    const user = await Users.findByIdAndUpdate(id, req.body, {
      new: true, //return new user after update
      runValidators: true, //run validations after update
    });
    if (!user) {
      res.status(404).send();
    }
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send("No user found!");
    }
    req.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
