const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const Users = require("../schema/usersSchema");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendUnsubscribeEmail } = require("../emails/account");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new Users(req.body);

  try {
    const token = await user.generateAuthToken(); //always use await when promise is returned
    await sendWelcomeEmail(user.email, user.name);
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

    res.status(200).send(req.user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    await sendUnsubscribeEmail(req.user.email, req.user.name);

    res.send("Successfully deleted profile");
  } catch (err) {
    res.status(400).send(err);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send("Successfully Uploaded");
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send("Successfully Deleted");
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("No image found");
    }
    res.set("Content-Type", "image/jpg"); //se header
    res.send(user.avatar);
  } catch (err) {
    res.status(400).send();
  }
});

module.exports = router;
