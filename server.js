const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors:{
    origin: "*",
    methods: ["GET","POST"]
  }
});

const cors = require("cors")

app.use(cors())

app.get("/",(req,res)=>{
  res.sendFile(__dirname + "./index.html")
})

server.listen(3000,()=>{
  console.log("listening on 3000");
})

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})