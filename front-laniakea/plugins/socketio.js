class SocketHandler {
  constructor (socket) {
    this.socket = socket
  }

  eventHandler () {
    return this.socket
  }

  joinRoom (uniqueid) {
    this.socket.emit('joinRoom', uniqueid)
  }

  join (data) {
    this.socket.emit('join', JSON.stringify(data))
  }

  chat (data) {
    this.socket.emit('chat', JSON.stringify(data))
  }
}

export default (_, inject) => {
  inject('socket', input => socket(input))
}

function socket (options) {
  const { io } = require('socket.io-client')
  const SERVER_URL = 'http://localhost:1337'
  const socketEntity = io(SERVER_URL, { auth: options })

  return new SocketHandler(socketEntity)
}
