require('dotenv').config()

const io = require("socket.io")(8082, {cors: {
  origin: process.env.CLIENT_URI,
  methods: ["GET", "POST"]
}})
var rooms = {}
io.on('connection', socket => {
  socket.on('joinRoom', room => {
    socket.join(room);
    rooms[socket.id] = room
  })
  socket.on('join', message => {
    io.to(rooms[socket.id]).emit('join', message)
  })
  socket.on('bye', message => {
    io.to(rooms[socket.id]).emit('join', message)
  })
  socket.on('chat', message => {
    io.to(rooms[socket.id]).emit('message', message)
  })
  socket.on('play', () => {
    io.to(rooms[socket.id]).emit('play')
  })
  socket.on('pause', () => {
    io.to(rooms[socket.id]).emit('pause')
  })
  socket.on('seekTo', time => {
    io.to(rooms[socket.id]).emit('seekTo', time)
  })
})