import { Socket, Server } from "socket.io"

import { generateSessionId } from "./lib/utils"
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
	PlayerInitializationPayload,
	RoomID,
	Player,
} from "./types"

import { RoomManager } from "./roomManager"
import { InMemorySessionStore as SessionStore } from "./sessionManager"

export class Game {
	private sessionStore: SessionStore
	private roomManager: RoomManager

	constructor(
		private server: Server<
			ClientToServerEvents,
			ServerToClientEvents,
			{},
			SocketData
		>
	) {
		this.sessionStore = new SessionStore()
		this.roomManager = new RoomManager()
		this.initialize()
	}

	private initialize() {
		this.server.use((socket: Socket, next) => {
			const roomId = socket.handshake.auth.roomId
			const nickname = socket.handshake.auth.nickname
			const sessionId = socket.handshake.auth.sessionId

			if (sessionId) {
				const session = this.sessionStore.findSession(sessionId)
				if (session) {
					socket.data.sessionId = sessionId
					socket.data.nickname = session.nickname
					socket.data.roomId = roomId

					return next()
				}
			}
			socket.data.sessionId = generateSessionId()
			socket.data.nickname = nickname // Can be undefined
			socket.data.roomId = roomId

			return next()
		})

		this.server.on(
			"connect",
			(
				socket: Socket<
					ClientToServerEvents,
					ServerToClientEvents,
					{},
					SocketData
				>
			) => {
				/**
				 * Establish Sessions for all Web Socket Connections
				 */
				// this.sessionStore.saveSession(socket.data.sessionId, {
				// 	nickname: socket.data.nickname,
				// 	connected: true,
				// })

				const playerInitData: PlayerInitializationPayload =
					socket.data.nickname !== undefined
						? {
								sessionId: socket.data.sessionId,
								playerData: {
									roomId: socket.data.roomId,
									nickname: socket.data.nickname,
									sessionId: socket.data.sessionId,
									// socket: socket,
								},
						  }
						: {
								sessionId: socket.data.sessionId,
								playerData: undefined,
						  }

				// console.log(playerInitData)
				// console.log("will emit")
				this.createEventListeners(socket)
				socket.emit("PlayerInitialization", playerInitData)
			}
		)
	}

	private createEventListeners(
		socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
	) {
		socket.on("PlayerJoin", (player: Player) => {
			if (this.roomManager.joinRoom(player.roomId, player)) {
				socket.join(player.roomId)
				this.emitGameState(player.roomId)
			}
		})
		socket.on("PlayerLeave", (payload: Player) => {
			socket.leave(payload.roomId)
			this.emitGameState(payload.roomId)
		})
		socket.on("PlayerReconnect", (payload: Player) => {
			socket.join(payload.roomId)
			this.emitGameState(payload.roomId)
		})

		socket.on("disconnecting", (reason) => {
			console.log(`Disconnecting ${socket.id} for "${reason}"`)
			const exitRoomId = socket.handshake.auth.roomId
			socket.leave(exitRoomId)
			this.roomManager.leaveRoom(exitRoomId, socket.id)
			this.emitGameState(exitRoomId)
		})
		socket.onAny((event, ...args) => {
			console.log(event, args)
		})
	}

	private emitGameState(roomId: RoomID): void {
		this.server.to(roomId).emit("GameStateUpdate", {
			roomId: roomId,
			players: this.roomManager.getParticipants(roomId),
		})
	}
}
