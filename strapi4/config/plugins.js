const randomColor = require('randomcolor')
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
            strapi.log.info("connection")
            console.log('connection')
            let users = []
            
            socket.on('joinRoom', (room) => {
              users.push({
                id: socket.id,
                username: socket.handshake.auth.username,
                title_color: randomColor()
              });

              socket.join(room);
              socket.rooms[socket.id] = room
              socket.to(socket.rooms[socket.id]).emit('newMember', users)
            })

            socket.on('join', message => {
              socket.to(socket.rooms[socket.id]).emit('join', message)
            })

            socket.on('bye', message => {
              socket.to(socket.rooms[socket.id]).emit('join', message)
              users.splice(users.indexOf(socket.handshake.auth.username), 1)
              socket.to(socket.rooms[socket.id]).emit('newMember', users)
            })

            socket.on('chat', message => {
              socket.to(socket.rooms[socket.id]).emit('message', message)
            })

            socket.on('play', () => {
              socket.to(socket.rooms[socket.id]).emit('play')
            })

            socket.on('pause', () => {
              socket.to(socket.rooms[socket.id]).emit('pause')
            })

            socket.on('seekTo', time => {
              socket.to(socket.rooms[socket.id]).emit('seekTo', time)
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
