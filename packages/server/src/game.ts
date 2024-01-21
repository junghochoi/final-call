import { Socket, Server } from "socket.io"

import { generateSessionId } from "./lib/utils"
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
	PlayerInitializationPayload,
	RoomID,
	Player,
	Stage,
	PlayerInitializationCallback,
	PlayerInit,
} from "./types"

import { RoomManager } from "./roomManager"
import { InMemorySessionStore as SessionStore } from "./sessionManager"

export class Game {
	private sessionStore: SessionStore
	private roomManager: RoomManager

	constructor(private server: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>) {
		this.sessionStore = new SessionStore()
		this.roomManager = new RoomManager()
		this.initialize()
	}

	private initialize() {
		// this.server.sockets.sockets.get("hello world")
		// this.server.use((socket: Socket, next) => {
		// 	const roomId = socket.handshake.auth.roomId
		// 	const nickname = socket.handshake.auth.nickname
		// 	const sessionId = socket.handshake.auth.sessionId

		// 	if (sessionId) {
		// 		console.log(sessionId)
		// 		const session = this.sessionStore.findSession(sessionId)
		// 		console.log(session)
		// 		if (session) {
		// 			socket.data.sessionId = sessionId
		// 			socket.data.nickname = session.nickname
		// 			socket.data.roomId = roomId

		// 			return next()
		// 		}
		// 	}
		// 	socket.data.sessionId = generateSessionId()
		// 	socket.data.nickname = nickname // Can be undefined, used to check if came from link or not
		// 	socket.data.roomId = roomId

		// 	return next()
		// })

		this.server.on("connect", (socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>) => {
			this.createEventListeners(socket)
		})
	}

	private createEventListeners(socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>) {
		socket.on("PlayerInitialization", (playerInitData: PlayerInit, callback: PlayerInitializationCallback) => {
			const { sessionId, roomId, host, nickname, socketId } = playerInitData

			if (sessionId && this.sessionStore.hasSession(sessionId)) {
				const session = this.sessionStore.findSession(sessionId)
				socket.data.sessionId = sessionId
			} else {
				socket.data.sessionId = generateSessionId()
			}

			socket.data.nickname = nickname
			socket.data.roomId = roomId

			// const playerInitData: PlayerInitializationPayload =
			// 	socket.data.nickname !== undefined
			// 		? {
			// 				sessionId: socket.data.sessionId,
			// 				playerData: {
			// 					roomId: socket.data.roomId,
			// 					nickname: socket.data.nickname,
			// 					sessionId: socket.data.sessionId,
			// 					host: socket.data.host,
			// 					socketId: socket.id,
			// 				},
			// 		  }
			// 		: {
			// 				sessionId: socket.data.sessionId,
			// 				playerData: undefined,
			// 		  }

			const playerData: Player = {
				nickname: socket.data.nickname,
				roomId,
				sessionId: socket.data.sessionId,
				host: false,
				socketId: socket.id,
			}

			callback(playerData)

			// const data = callback(data)

			// socket.emit("PlayerInitializationResponse", playerInitData)
		})
		socket.on("PlayerJoin", (player: Player) => {
			if (this.roomManager.joinRoom(player.roomId, player)) {
				socket.join(player.roomId)
				this.emitGameState(player.roomId)

				console.log(`Storing in SessionStore ${socket.data.sessionId}`)
				this.sessionStore.saveSession(socket.data.sessionId, {
					nickname: socket.data.nickname!,
					connected: true,
				})
			}
		})
		socket.on("PlayerLeave", (payload: Player) => {
			socket.leave(payload.roomId)
			this.emitGameState(payload.roomId)

			this.sessionStore.saveSession(socket.data.sessionId, {
				nickname: socket.data.nickname!,
				connected: false,
			})
		})
		socket.on("PlayerReconnect", (payload: Player) => {
			socket.join(payload.roomId)
			this.emitGameState(payload.roomId)
		})
		socket.on("StageChange", (payload: { stage: Stage }) => {
			this.roomManager.changeStage(socket.data.roomId, payload.stage)
			this.emitGameState(socket.data.roomId)
		})

		socket.on("disconnect", (reason) => {
			console.log(`Disconnecting ${socket.id} for "${reason}"`)
			const exitRoomId = socket.data.roomId

			this.roomManager.leaveRoom(exitRoomId, socket.data.sessionId)
			socket.leave(exitRoomId)
			this.emitGameState(exitRoomId)
		})

		// ------------ Game Related Events -----------------

		socket.onAny((event, ...args) => {
			console.log(event, args)
		})
	}

	private emitGameState(roomId: RoomID): void {
		const gameState = this.roomManager.getRoomGameState(roomId)

		if (gameState) {
			this.server.to(roomId).emit("GameStateUpdate", gameState)
		}
	}
}
