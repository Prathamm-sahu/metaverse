import http from "http"
import express from "express"
import { WebSocketServer } from "ws"
import { UserManager } from "./lib/UserManager"

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const wss = new WebSocketServer({ server })

const userManager = new UserManager()

wss.on("connection", (ws, req) => {
  console.log("user connected")
  ws.on("message", (data, isBinary) => {
    const message = JSON.parse(data.toString())
    const user = userManager.getUser({ roomId: message.payload.roomId, userId: message.payload.userId })
    if(message.payload.userId === user?.id) {
      userManager.updateUser({ roomId: message.payload.roomId, userId: message.payload.userId, socket: ws })
    }
    
    messageHandler(ws, message)
  })
})


function messageHandler(ws: any, message: any) {
  // Join Room
  if(message.type === "JOINROOM") {
    const { roomId, roomType, name, userId, username, description, password } = message.payload
    
    userManager.addUser({ roomId, roomType, description, name, password, socket: ws, userId, username })

    return;
  }

  if(message.type === "UPDATE_PLAYER_POSITION") {
    const { roomId, userId, x, y, anim } = message.payload

    userManager.broadcast({ roomId, userId, x, y, anim })
  }
}

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))