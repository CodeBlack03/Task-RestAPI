const express = require("express");
const Tasks = require("../schema/taskSchema");
const router = new express.Router();
const auth = require("../middleware/auth");
router.post("/tasks", auth, async function (req, res) {
  const task = new Tasks({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send(err);
  }

  //res.send("POST request to the homepage");
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // const foundTasks = await Tasks.find({ owner: req.user._id });
    await req.user.populate("tasks").execPopulate();

    res.status(200).send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const foundTask = await Tasks.findOne({ _id, owner: req.user.id });
    //await foundTask.populate("owner").execPopulate();
    if (!foundTask) {
      res.status(404).send();
    }
    res.send(foundTask);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body); //convert object to an array of properties
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    res.status(400).status("Invalid Operation!");
  }
  const id = req.params.id;

  try {
    const task = await Tasks.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!task) {
      res.status(404).send();
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Tasks.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    // const task = await Tasks.findByIdAndDelete(id);

    if (!task) {
      res.status(404).send("No task found!");
    }
    console.log(task);
    await task.remove();

    res.status(200).send(task);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
