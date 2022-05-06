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
          "handler": ({ strapi }, socket) => {
            strapi.log.info(`[io] new connection with id ${socket.id}.`);
            socket.emit("message:update", {
              id: socket.id
            });
            
            socket.on('joinRoom', (room) => {
              socket.join(room);
              socket.rooms[socket.id] = room
              console.log(`[io] ${socket.id} joined ${room}. Rooms: ${JSON.stringify(socket.rooms)}`)
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
