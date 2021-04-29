const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const socketio = require("socket.io");
const { Socket } = require("dgram");
// app.use(cors);
app.use(express.json());
io = socketio(server);

// app.get('/',(req,res)=>{
//     res.send("server can reach client")
// })
io.on("connect", (socket) => {
  console.log("new client connected " + socket.id);
  socket.on("send_all", (data) => {
    socket.broadcast.emit("disp", data);
  });

  socket.on('send',(data)=>{
    io.sockets.emit('sendfs',data)
  })
  socket.on("unsubsribe", (room) => {
    socket.leave(room);
    console.log("client unsubcribed ", room);
  });
  socket.on("subscribe", (room) => {
    socket.join(room);
    console.log("client subscribed room ", room);
  });
  socket.on("roommsg", (data) => {
    console.log(data);
    io.to(data.roomno).emit("userroom", data);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected ", socket.id);
  });
});

server.listen("3010", () => {
  console.log("server is running on 3010");
});
