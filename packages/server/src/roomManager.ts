import {
	GameStateUpdatePayload,
	IndividualGameStateUpdatePayload,
	Player,
	RoomID,
	SessionID,
	Stage,
} from "@final-call/shared"
import { Room } from "./room"

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

	makePlayerPass(roomId: RoomID, sessionId: SessionID): boolean {
		const room = this.rooms.get(roomId)

		if (!room) return false

		return room.makePlayerPass(sessionId)
	}
}
