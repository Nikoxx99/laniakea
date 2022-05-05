'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const randomColor = require('randomcolor')
    const io = require("socket.io")(strapi, {cors: {
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
        title_color: randomColor()
      });
      io.to(rooms[socket.id]).emit('newMember', users)
      socket.on('joinRoom', room => {
        socket.join(room);
        rooms[socket.id] = room
        io.to(rooms[socket.id]).emit('newMember', users)
      })
      socket.on('join', message => {
        socket.to(rooms[socket.id]).emit('join', message)
      })
      socket.on('bye', message => {
        io.to(rooms[socket.id]).emit('join', message)
        users.splice(users.indexOf(socket.username), 1)
        io.to(rooms[socket.id]).emit('newMember', users)
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
  },
};
