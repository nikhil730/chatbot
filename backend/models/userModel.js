const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  role: { type: String, required: true },
  message: { type: String, required: true },
  _id: false,
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  chats: [chatSchema],
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
