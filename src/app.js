//require("dotenv").config({ path: __dirname + "../config/dev/.env" });
const express = require("express");
const app = express();
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");
require("./db/mongoose");

app.use(express.json()); //can fetch json data in post method

//----------Users--------------------------------
app.use(userRouter);
//----------Tasks--------------------------------
app.use(taskRouter);

module.exports = app;
