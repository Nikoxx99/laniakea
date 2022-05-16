const randomColor = require('randomcolor')
let users = []
module.exports = ({ env }) => ({
  "io": {
    "rooms": {},
    "enabled": true,
    "config": {
      "IOServerOptions" :{
        "cors": { "origin": "http://localhost:8000", "methods": ["GET"] },
      },
      "contentTypes": {
        "message": "*",
        "chat":["create"]
      },
      "events":[
        {
          "name": "connection",
          "handler": ({strapi}, socket) => {
            const isDev = process.env.NODE_ENV === 'development'
            isDev ? strapi.log.info("Socket connection") : null
            isDev ? strapi.log.info(`[Auth] ${JSON.stringify(socket.handshake.auth)}`) : null
            
            socket.on('joinRoom', (room) => {
              users.push({
                id: socket.id,
                username: socket.handshake.auth.username,
                title_color: randomColor()
              });

              socket.join(room);
              socket.rooms[socket.id] = room
              socket.to(socket.rooms[socket.id]).emit('newMember', users)
              isDev ? strapi.log.info(`[Info] User ${socket.handshake.auth.username} join room ${room}. The room now has ${users.length} members`) : null
            })

            socket.on('join', message => {
              socket.to(socket.rooms[socket.id]).emit('join', message)
              isDev ? strapi.log.info(`[join] new message: ${message}`) : null
            })

            socket.on('bye', message => {
              socket.to(socket.rooms[socket.id]).emit('join', message)
              users.splice(users.indexOf(socket.handshake.auth.username), 1)
              socket.to(socket.rooms[socket.id]).emit('newMember', users)
              isDev ? strapi.log.info(`[bye] new bye: ${message}`) : null
            })

            socket.on('chat', message => {
              socket.to(socket.rooms[socket.id]).emit('chat', message)
              isDev ? strapi.log.info(`[chat] ${message}`) : null
            })

            socket.on('play', () => {
              socket.to(socket.rooms[socket.id]).emit('play')
              isDev ? strapi.log.info(`[play event]`) : null
            })

            socket.on('pause', () => {
              socket.to(socket.rooms[socket.id]).emit('pause')
              isDev ? strapi.log.info(`[pause event]`) : null

            })

            socket.on('seekTo', time => {
              socket.to(socket.rooms[socket.id]).emit('seekTo', time)
              isDev ? strapi.log.info(`[seekTo] time: ${time}`) : null
            })
          },
        },
      ]
    },
  },

  'transformer': {
    enabled: true,
    config: {
      prefix: '/api/',
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      }
    }
  },
});
