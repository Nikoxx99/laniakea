export default (_, inject) => {
  inject('socket', input => socket(input))
}

function socket (options) {
  const { io } = require('socket.io-client')
  const SERVER_URL = 'http://localhost:1337'
  const socket = io(SERVER_URL, options)

  return socket
}
