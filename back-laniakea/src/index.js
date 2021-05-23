const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 8082 })
const lookup = {}
wss.on("connection", (ws, req) => {
  console.log("New connection")
  ws.id = req.url.replace('/?token=', '')
  lookup[ws.id] = ws;
  ws.on("message",function message(msg){
    lookup[ws.id].send(msg)
  })

  ws.on("close", () => {
    console.log("Disconnected")
  })
})