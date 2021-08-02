'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

require('dotenv').config()
module.exports = async () => {
  process.nextTick(() =>{
    const io = require("socket.io")(strapi.server, {cors: {
      origin: 'http://localhost:8000',
      methods: ["GET", "POST"]
    }})
    io.use((socket, next) => {
      const username = socket.handshake.auth.username;
      if (!username) {
        return next(new Error("invalid username"));
      }
      socket.username = username;
      next();
    });
    var rooms = {}
    var users = [];
    io.on('connection', socket => {
      users.push({
        id: socket.id,
        username: socket.username,
      });
      io.to(rooms[socket.id]).emit('newMember', users)
      socket.on('joinRoom', room => {
        console.log(socket.username, 'connected')
        socket.join(room);
        rooms[socket.id] = room
        io.to(rooms[socket.id]).emit('newMember', users)
      })
      socket.on('join', message => {
        io.to(rooms[socket.id]).emit('join', message)
      })
      socket.on('bye', message => {
        io.to(rooms[socket.id]).emit('join', message)
        users.splice(users.indexOf(socket.username), 1)
        io.to(rooms[socket.id]).emit('newMember', users)
      })
      socket.on('chat', message => {
        io.to(rooms[socket.id]).emit('message', message)
        console.log(users)
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
      socket.on('disconnect', socket => {
        console.log(socket.username, 'disconnected', users, 'remaining')
      })
    })
  })
};
