const mongoose = require("mongoose"); // Erase if already required
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Tasks = require("./taskSchema");
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Invalid!");
        }
      },
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Please re create a strog password");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error(" Age must be a positive number");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
//virtual entity - relationship
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id", //relationship between User and Tasks
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, "thisismyappication", {
    expiresIn: "1 week",
  });

  user.tokens = user.tokens.concat({ token: token });
  //console.log("token", user.tokens);
  //console.log(token);
  await user.save();

  return token;
};

//Authentication by adding a method to Users model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await Users.findOne({ email: email });

  if (!user) {
    throw new Error("No user found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

//middleware : hashing password after saving and updating before save
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Tasks.deleteMany({ owner: user._id });
  next();
});

//Export the model
const Users = mongoose.model("User", userSchema);
module.exports = Users;
