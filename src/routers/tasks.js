const express = require("express");
const Tasks = require("../schema/taskSchema");
const router = new express.Router();

router.post("/tasks", async function (req, res) {
  const task = new Tasks(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send(err);
  }

  //res.send("POST request to the homepage");
});

router.get("/tasks", async (req, res) => {
  try {
    const foundTasks = await Tasks.find({});
    res.status(200).send(foundTasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const foundTask = await Tasks.findById({ _id: req.params.id });
    if (!foundTask) {
      res.status(404).send();
    }
    res.status(200).send(foundTask);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", async (req, res) => {
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
    const task = await Tasks.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res.status(404).send();
    }
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.getMaxListeners("/tasks/:id", async (req, res) => {
  try {
    const task = await Tasks.findByIdAndDelete(id);
    if (!task) {
      res.status(404).send("No task found!");
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.export = router;
