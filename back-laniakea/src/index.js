const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 8082 })

wss.on("connection", ws => {
  console.log("New connection")

  ws.on("message", data => {
    console.log(data)

    ws.send(data.toUpperCase())
  })

  ws.on("close", () => {
    console.log("Disconnected")
  })
})