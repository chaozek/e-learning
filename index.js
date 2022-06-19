import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
const http = require("http");
var csrf = require("csurf");
var bodyParser = require("body-parser");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const router = express.Router();

dotenv.config();
//db
const URI = process.env.MONGODB_URL;

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
}); //in case server and client run on different urls
io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.join("clock-room");

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});
setInterval(() => {
  io.to("clock-room").emit("time", new Date());
}, 1000);
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));
//routes
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//var parseForm = bodyParser.urlencoded({ extended: false });
var csrfProtection = csrf({ cookie: true });
fs.readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);
app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/FE/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "FE", "build", "index.html"));
  });
}

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log("SERVER RUNNING" + port);
});
