import { io, Socket } from 'socket.io-client'
import { v4 } from 'uuid'

interface ServerToClientEvents {
  // test: (a: string) => void
  // noArg: () => void
  // basicEmit: (a: number, b: string, c: Buffer) => void
  // withAck: (d: string, callback: (e: number) => void) => void
  // join: (d: string, callback: (e: string) => void) => void
  startGame: (e: { players: any; firstPlayer: any }) => void
  playerTurn: (streak: number) => void
  flipCard: (index: number) => void
  addScore: () => void
  gameOver: (winner: any) => void
  mainScene: () => void
  admin_updateData: (data: any) => void
}

interface ClientToServerEvents {
  join: (d: any, callback: (d: any) => void) => void
  turnOver: (score: number) => void
  cardClick: (cardIndex) => void
  match: () => void
  restartGame: () => void
  createInviteGame: (d: string, callback: (d: any) => void) => void
  playerReady: (callback: (d: any) => void) => void
  adminLogin: (d: any, callback: (d: any) => void) => void
  admin_getServerInfo: (d: any, callback: (d: any) => void) => void
}

type Connection = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
  connectionId: string
}

class SocketConnection {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
  connectionId: string
  public connection: Connection

  // regex expression for a word
  // const wordRegex = new RegExp('^[a-zA-Z]+$')
  constructor() {
    // production https://mg-service.onrender.com
    const { VITE_MG_SERVER_URL } = import.meta.env
    // console.log('VITE_MG_SERVER_URL: ' + VITE_MG_SERVER_URL)
    this.socket = io(VITE_MG_SERVER_URL, { autoConnect: false })
    // this.socket = io('http://10.0.0.35:8000', { autoConnect: false })
    this.connectionId = v4()

    this.socket.auth = { connectionId: this.connectionId }
    // this.socket.connectionId = this.connectionId
    this.connection = { socket: this.socket, connectionId: this.connectionId }
    console.log('connectionId: ' + this.connectionId)
  }

  getSocket() {
    return this.socket
  }

  connect() {
    this.socket.connect()

    // this.socket.on('connect', (data) => {
    //   this.socket.emit('getPlayer')
    // })

    // this.socket.on('updatePlayer', (data) => {
    //   const playerData = JSON.parse(data)
    //   //   console.log('player: ' + playerData.id + ' updated')
    // })
  }
}

const socketConnection = new SocketConnection()
socketConnection.connect()
// const socket = socketConnection.getSocket()
// socket.connectionId = socketConnection.connectionId
const connection = socketConnection.connection
console.log('connection: ' + connection)
export default connection
