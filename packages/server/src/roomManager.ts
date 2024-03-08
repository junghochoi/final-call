import {
	GameStateUpdatePayload,
	IndividualGameStateUpdatePayload,
	Player,
	Property,
	RoomID,
	SessionID,
	Stage,
} from "@final-call/shared"
import { Room } from "./room"
import { UpdateInfo } from "./auctionStateManager"

export class RoomManager {
	private rooms: Map<RoomID, Room>

	constructor() {
		this.rooms = new Map()
	}

	getRoomGameState(roomId: RoomID): GameStateUpdatePayload | undefined {
		const room = this.rooms.get(roomId)

		if (room) {
			return room.getGameState()
		}

		console.log(`getRoomState: ROOM NOT FOUND: "${roomId}"`)
		return undefined
	}
	getRoomIndividualGameState(roomId: RoomID, sessionId: SessionID): IndividualGameStateUpdatePayload | undefined {
		const room = this.rooms.get(roomId)

		if (room) {
			return room.getIndividualGameState(sessionId)
		}

		console.log(`getRoomIndividualGameState: ROOM NOT FOUND: "${roomId}"`)
		return undefined
	}

	createRoom(roomId: RoomID): Room {
		const room: Room = new Room(roomId)
		this.rooms.set(roomId, room)
		console.log(`CREATED ROOM - "${roomId}"`)
		return room
	}

	deleteRoom(roomId: RoomID): void {
		console.log(`DELETING ROOM - "${roomId}"`)
		this.rooms.delete(roomId)
	}

	joinRoom(roomId: RoomID, user: Player): boolean {
		if (!this.rooms.has(roomId)) {
			this.createRoom(roomId)
		}

		const room = this.rooms.get(roomId)
		if (room) {
			room.addPlayer(user)
			return true
		}
		return false
	}

	hasRoom(roomId: RoomID): boolean {
		return this.rooms.has(roomId)
	}

	leaveRoom(roomId: RoomID, sessionId: SessionID): boolean {
		const room = this.rooms.get(roomId)
		if (room) {
			room.removePlayer(sessionId)
			if (room.getPlayerCount() === 0) {
				this.deleteRoom(roomId)
			}
			return true
		}
		return false
	}

	canPlayerJoin(roomId: RoomID): { error: boolean; message: string } {
		const room = this.rooms.get(roomId)

		if (room) {
			return room.hasGameStarted()
				? { error: true, message: "Game Has Already Begun, Wait for Game to finish" }
				: { error: false, message: "Player Can Join" }
		}
		return { error: true, message: "Room Does not Exist" }
	}

	getParticipant(roomId: RoomID, sessionId: SessionID): Player | undefined {
		const room = this.rooms.get(roomId)
		if (room) {
			return room.getParticipant(sessionId)
		}
		console.log(`getParticipant: ROOM NOT FOUND: "${roomId}"`)
		return undefined
	}

	getParticipants(roomId: RoomID): Player[] {
		const room = this.rooms.get(roomId)
		if (room) {
			return room.getPlayers()
		}

		console.log(`getParticipants: ROOM NOT FOUND: "${roomId}"`)
		return []
	}

	changeStage(roomId: RoomID, stage: Stage) {
		const room = this.rooms.get(roomId)
		if (room) {
			room.changeStage(stage)
			return
		}
		console.log(`changeStage: ROOM NOT FOUND: "${roomId}"`)
	}

	makePlayerBid(roomId: RoomID, sessionId: SessionID, amount: number): boolean {
		const room = this.rooms.get(roomId)

		if (!room) return false

		return room.makePlayerBid(sessionId, amount)
	}

	makePlayerPass(roomId: RoomID, sessionId: SessionID): { success: boolean; emitGameState: boolean } {
		const room = this.rooms.get(roomId)

		if (!room) return { success: false, emitGameState: false }

		return room.makePlayerPass(sessionId)
	}

	startNewBiddingRound(roomId: RoomID) {
		const room = this.rooms.get(roomId)

		if (!room) return

		room.startNewBiddingRound()
	}

	startNewAuctionRound(roomId: RoomID) {
		const room = this.rooms.get(roomId)

		if (!room) return

		room.startNewAuctionRound()
	}

	makePlayerSell(roomId: RoomID, sessionId: SessionID, property: Property): UpdateInfo {
		const room = this.rooms.get(roomId)

		if (!room) return { success: false, submitAllIndividualStates: false }

		return room.makePlayerSell(sessionId, property)
	}

	needToChangeStage(roomId: RoomID): Stage | undefined {
		const room = this.rooms.get(roomId)

		if (!room) return undefined

		return room.needToChangeStage()
	}
}
