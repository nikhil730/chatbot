require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const server = http.createServer(app);
const axios = require("axios");
const port = 3000;
const jwt = require("jsonwebtoken");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Establishing a MongoDB connection
// const url =
//   "mongodb+srv://nikhil:.eebuL5tURPiNtx@cluster0.8jqmdrx.mongodb.net/chatboat";
mongoose
  .connect(process.env.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log(`Server runing on port: ${port} , Connected to Mongodb`);
  })
  .catch((err) => console.log(err));

const chatSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  message: { type: String, required: true },
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  chats: [chatSchema],
});
const User = mongoose.model("User", userSchema);
const Chats = mongoose.model("Chats", chatSchema);

// Creating a socket connection
const socket = require("socket.io");
// const key = "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";
// const configuration = new Configuration({
//     apiKey: key,
// });
// const openai = new OpenAI({
//   apiKey: key,
// });
const io = new socket.Server(server, {
  path: "/api/socket.io",
  cookie: false,
  cors: { credentials: true, origin: true },
});

// Configuring a socket event handler
const chatHistory = [];
io.on("connection", (socket) => {
  socket.on("sendMessage", async (data) => {
    // chatHistory.push({ role: "user", content: data.text });
    console.log(chatHistory);
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
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
    const user = data.user;
    const completion = response.data.choices[0].text;
    console.log(completion);
    // const chatCompletion = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: chatHistory,
    // });
    // console.log(chatCompletion);
    socket.emit("receiveMessage", {
      message: `${completion}`,
    });
    chatHistory.push({
      from: "user",
      to: "Ai",
      message: data.text,
    });
    chatHistory.push({
      from: "Ai",
      to: "user",
      message: completion,
    });

    // chat.save();
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

app.post("/api/users", async function (req, res) {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  console.log(password);

  if (existingUser) {
    console.log("Existing user:", existingUser);

    const passwordMatch = password === existingUser.password;
    if (passwordMatch) {
      console.log("Password match", existingUser.password);
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ success: true, user: existingUser, token: token });
      console.log(token);
      // Passwords match, user is authenticated
      return { success: true, user: existingUser, token: token };
    } else {
      console.log("Incorret");
      res.json({ success: false, message: "Incorrect password" });
      // Passwords don't match
      return { success: false, message: "Incorrect password" };
    }
  } else {
    const newUser = new User({
      // id: uuidv4(),
      email: email,
      password: password,
      chats: [],
    });
    newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);
    return { success: true, user: newUser, token: token };
  }
});
app.post("/api/user/getUserData", async function (req, res) {
  try {
    let userid = "";
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        console.log(err);
        return res.status(200).send({
          message: "Auth Failed",
          success: false,
        });
      } else {
        console.log("decode " + decode.id);
        userid = decode.id;
      }
    });
    const user = await User.findById({ _id: userid });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: `User Not Found`, success: false });
    } else {
      console.log(user);
      return {
        success: true,
        data: user,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: `Auth Error ${error.message}`,
    };
  }
});

server.listen(port);
