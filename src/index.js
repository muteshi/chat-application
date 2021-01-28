const express = require("express");
const http = require("http");
const { generateMsg, generateLocationMsg } = require("../src/utils/messages");
const chalk = require("chalk");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log(chalk.bold.green("New webSocket connection.."));

  socket.emit("message", generateMsg("Welcome"));
  socket.broadcast.emit(generateMsg("message", "A new user has joined"));

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity not allowed");
    }

    io.emit("message", generateMsg(message));
    callback();
  });

  socket.on("sendLocation", ({ lat, lng }, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMsg(`https://www.google.com/maps?q=${lat},${lng}`)
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMsg("A user has left"));
  });
});

server.listen(port, () => {
  console.log(chalk.bold.green("Server is running on port " + port));
});
