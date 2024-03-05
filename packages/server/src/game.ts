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
	BidAction,
	PassAction,
	SessionID,
	Sound,
} from "@final-call/shared"

import { RoomManager } from "./roomManager"
import { InMemorySessionStore as SessionStore } from "./sessionManager"
import { Room } from "./room"

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

		socket.on("GameAction", (payload) => {
			const { roomId, action } = payload

			switch (action.name) {
				case "bid": {
					this.roomManager.makePlayerBid(socket.data.roomId, action.player.sessionId, action.amount)
					this.emitIndividualGameState(socket)
					this.emitSound(roomId, Sound.Bet)

					break
				}

				case "pass": {
					const { success, emitGameState } = this.roomManager.makePlayerPass(
						socket.data.roomId,
						action.player.sessionId
					)
					// this.emitIndividualGameState(socket)
					this.emitAllIndividualGameState(roomId)
					this.emitSound(roomId, Sound.Pass)

					if (emitGameState) {
						setTimeout(() => {
							console.log("SetTimeout Executing")
							this.roomManager.startNewBiddingRound(roomId)
							this.emitAllIndividualGameState(roomId)
							this.emitGameState(roomId)
							this.changeStageIfNeeded(socket.data.roomId)
							this.emitGameState(socket.data.roomId)
						}, 4000)
					}

					break
				}
				case "sell": {
					const info = this.roomManager.makePlayerSell(socket.data.roomId, action.player.sessionId, action.property)

					if (info.submitAllIndividualStates) {
						this.emitAllIndividualGameState(roomId)
						setTimeout(() => {
							console.log("SetTimeout Executing")
							this.roomManager.startNewAuctionRound(roomId)
							this.emitAllIndividualGameState(roomId)
							this.emitGameState(roomId)
							this.changeStageIfNeeded(socket.data.roomId)
							this.emitGameState(socket.data.roomId)
						}, 5000)
					} else {
						this.emitIndividualGameState(socket)
					}

					break
				}
			}

			this.changeStageIfNeeded(socket.data.roomId)
			this.emitGameState(socket.data.roomId)
		})

		socket.on("IndividualGameStateInitialization", (player, callback) => {
			const individualGameState = this.roomManager.getRoomIndividualGameState(socket.data.roomId, socket.data.sessionId)

			if (!individualGameState) return

			callback(individualGameState)
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

	private emitSound(roomId: RoomID, sound: Sound): void {
		this.server.to(roomId).emit("PlaySound", { sound })
	}

	private emitIndividualGameState(socket: Socket) {
		const individualGameState = this.roomManager.getRoomIndividualGameState(socket.data.roomId, socket.data.sessionId)
		if (individualGameState) {
			socket.emit("IndividualGameStateUpdate", individualGameState)
		}
	}

	private async emitAllIndividualGameState(roomId: RoomID) {
		const roomSockets = await this.server.in(roomId).fetchSockets()

		roomSockets.forEach((s) => {
			const individualGameState = this.roomManager.getRoomIndividualGameState(s.data.roomId, s.data.sessionId)
			if (individualGameState) {
				console.log(individualGameState)

				s.emit("IndividualGameStateUpdate", individualGameState)
			}
		})
	}

	private changeStageIfNeeded(roomId: RoomID) {
		const stageChange = this.roomManager.needToChangeStage(roomId)
		if (stageChange === undefined) return
		this.roomManager.changeStage(roomId, stageChange)
	}
}
