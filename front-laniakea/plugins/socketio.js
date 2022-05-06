export default (_, inject) => {
  inject('createSocket', input => createSocket(input))
}

function createSocket (options) {
  const { io } = require('socket.io-client')
  const SERVER_URL = 'http://localhost:1337'
  const socket = io(SERVER_URL, options)

  return socket
}
