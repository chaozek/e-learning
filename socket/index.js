const app = require("express")();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
  },
});
let interval;
const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};
io.on("connection", (socket) => {
  console.log("New client connected");
  io.emit("welcome");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
server.listen(8000);
