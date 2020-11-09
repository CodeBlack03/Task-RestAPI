const mongoose = require("mongoose");
const Users = require("../schema/usersSchema");
const Tasks = require("../schema/taskSchema");
mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect(
  process.env.MONGO_DB_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);

const me = new Users({
  name: "Harsh Vishwakarma",
  email: "harsh1234@gmail.com",
  password: "Password",
});

const task = new Tasks({
  description: "  Eat lunch",
});
