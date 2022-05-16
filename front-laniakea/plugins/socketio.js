class SocketHandler {
  constructor (socket) {
    this.socket = socket
  }

  eventHandler () {
    return this.socket
  }

  static joinRoom (uniqueid) {
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
PASAR EVENTLISTENERS AQUI Y LOS EMITTERS A FUNCIONES INJECTADAS
function socket (options) {
  const { io } = require('socket.io-client')
  const SERVER_URL = 'http://localhost:1337'
  const socketEntity = io(SERVER_URL, { auth: options })

  const s = new SocketHandler(socketEntity)
  console.log(s)
  return s
}

class Rectangulo {
  constructor (alto, ancho) {
    this.alto = alto
    this.ancho = ancho
  }
  // Getter

  get area () {
    return this.calcArea()
  }
  // Método

  static calcArea () {
    return this.alto * this.ancho
  }
}

const cuadrado = new Rectangulo(10, 10)

console.log(cuadrado)
