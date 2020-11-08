const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");
const auth = require("./middleware/auth");
require("./db/mongoose");

app.use(express.json()); //can fetch json data in post method

//----------Users--------------------------------
app.use(userRouter);
//----------Tasks--------------------------------
app.use(taskRouter);

app.listen(port, () => console.log(`Task app listening on port port!`));
