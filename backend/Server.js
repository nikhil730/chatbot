require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const server = http.createServer(app);
const axios = require("axios");

const jwt = require("jsonwebtoken");
const userModel = require("./models/userModel");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Establishing a MongoDB connection
const port = process.env.port || 3000;
mongoose
  .connect(process.env.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log(`Server runing on port: ${port} , Connected to Mongodb`);
  })
  .catch((err) => console.log(err));

// const chatSchema = new mongoose.Schema({
//   from: { type: String, required: true },
//   to: { type: String, required: true },
//   message: { type: String, required: true },
// });
// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
//   chats: [chatSchema],
// });
// const User = mongoose.model("User", userSchema);
// const Chats = mongoose.model("Chats", chatSchema);

// Creating a socket connection
const socket = require("socket.io");

// const configuration = new Configuration({
//     apiKey: key,
// });
// const openai = new OpenAI({
//   apiKey: key,
// });
app.get("/", (req, res) => {
  res.send("server runing");
});
const io = new socket.Server(server, {
  path: "/api/socket.io",
  cookie: false,
  cors: { credentials: true, origin: true },
});

// Configuring a socket event handler
io.on("connection", (socket) => {
  socket.on("sendMessage", async (data) => {
    // chatHistory.push({ role: "user", content: data.text });
    //console.log(chatHistory);
    console.log(data);

    // const user = data.user;
    const user = await userModel.findById({ _id: data.user._id });
    console.log("User=" + user);
    const chatHistory = user.chats;
    console.log("chathist" + chatHistory);
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt: data.text,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.key}`,
        },
      }
    );
    const completion = response.data.choices[0].text;
    //console.log(completion);
    // const chatCompletion = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: chatHistory,
    // });
    // console.log(chatCompletion);
    socket.emit("receiveMessage", {
      message: `${completion}`,
    });
    chatHistory.push({
      role: "client",
      message: data.text,
    });
    chatHistory.push({
      role: "server",
      message: completion,
    });
    user.chats = chatHistory;
    user.save();
    // chat.save();
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});
app.use("/api/user", require("./routes/userRoutes"));

server.listen(port);
