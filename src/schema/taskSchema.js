const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

//Export the model
module.exports = mongoose.model("Task", taskSchema);
