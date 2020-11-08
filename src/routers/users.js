const express = require("express");
const Users = require("../schema/usersSchema");
const router = new express.Router();
const auth = require("../middleware/auth");
router.post("/users", async (req, res) => {
  const user = new Users(req.body);

  try {
    const token = await user.generateAuthToken(); //always use await when promise is returned

    res.status(201).send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await Users.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user: user, token });
  } catch (err) {
    res.status(400).send("Incorrent credentials");
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send("Sucessfully loged out!");
  } catch (err) {
    res.status(500).send("Something went wrong, try again");
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Successfully loged out of All devices");
  } catch (err) {
    res.status(500).send("Something went wrong, try again!");
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});
// router.get("/users/:id", async (req, res) => {
//   try {
//     const foundUser = await Users.findById({ _id: req.params.id });
//     if (!foundUser) {
//       res.status(404).send();
//     }
//     await res.status(200).send(foundUser);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  ); //Update allowed or not
  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid Updates!",
    });
  }

  try {
    const id = req.user._id;
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    // const user = await Users.findByIdAndUpdate(id, req.body, {
    //   new: true, //return new user after update
    //   runValidators: true, //run validations after update
    // });

    res.status(201).send(req.user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send("Successfully deleted profile");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
