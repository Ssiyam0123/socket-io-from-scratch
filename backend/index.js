import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const app = express();

const port = 4000;
const server = createServer(app);
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
});

app.get("/", (req, res) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join-private", ({ userId, otherUserId }) => {
    const roomName = [userId, otherUserId].sort().join("_");
    socket.join(roomName);
    console.log(`joined private room: ${roomName}`);
  });

  socket.on("private-message", ({ roomName, message }) => {
    console.log("private message:", message);
    socket.to(roomName).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


server.listen(port, () => {
  console.log(`server connected on port : ${port}`);
});
