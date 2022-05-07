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
          "handler": (_, socket) => {
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
