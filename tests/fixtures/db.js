const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Users = require("../../src/schema/usersSchema");
const Tasks = require("../../src/schema/taskSchema");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Clark Kent",
  email: "ckentsuperman@gmail.com",
  password: "admin123",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Hal Jordan",
  email: "greenlantern@gmail.com",
  password: "admin123",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};
const taskOne = {
  _id: mongoose.Types.ObjectId(),
  description: "Defeat Sinestro",
  completed: false,
  owner: userTwoId,
};

const taskTwo = {
  _id: mongoose.Types.ObjectId(),
  description: "Defeat General Zod",
  completed: false,
  owner: userOneId,
};

const taskThree = {
  _id: mongoose.Types.ObjectId(),
  description: "Defeat Lex",
  completed: false,
  owner: userOneId,
};

const setupDatabase = async () => {
  await Users.deleteMany();
  await Tasks.deleteMany();
  await new Users(userOne).save();
  await new Users(userTwo).save();
  await new Tasks(taskOne).save();
  await new Tasks(taskTwo).save();
  await new Tasks(taskThree).save();
};
module.exports = {
  userOneId,
  userOne,
  setupDatabase,
  taskTwo,
  userTwo,
};
