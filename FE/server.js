// server.js
const { createProxyMiddleware } = require("http-proxy-middleware");
const { parse } = require("url");
const next = require("next");
const express = require("express");
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname });
const handle = app.getRequestHandler();
const cookieParser = require("cookie-parser");
/* import { io } from "socket.io-client";
 */
/* const socket = io("ws://localhost/8000",  cors: {
  origin: "https://example.com",
  methods: ["GET", "POST"]
}, { transports: ["websocket"] }); */
app
  .prepare()
  .then(() => {
    const server = express();
    // apply proxy in dev mode
    if (dev) {
      server.use(
        "/api",
        createProxyMiddleware({
          target: "http://localhost:5001",
          changeOrigin: true,
        })
      );
    }

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:5001");
    });
  })
  .catch((err) => {
    console.log("Error", err);
  });
