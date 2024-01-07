import { Player, RoomID, SessionID } from "./types"
import { Room } from "./room"

export class RoomManager {
	private rooms: Map<RoomID, Room>

	constructor() {
		this.rooms = new Map()
	}

	createRoom(roomId: RoomID): Room {
		const room: Room = new Room(roomId)
		this.rooms.set(roomId, room)
		console.log(`CREATED ROOM - "${roomId}"`)
		return room
	}

	deleteRoom(roomId: RoomID): void {
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

	handleUserDisconnect(sessionId: SessionID): RoomID {
		for (let [roomId, room] of this.rooms) {
			if (room.hasParticipant(sessionId)) {
				this.leaveRoom(roomId, sessionId)
				return roomId
			}
		}
		return ""
	}

	getParticipant(roomId: RoomID, sessionId: SessionID): Player | undefined {
		const room = this.rooms.get(roomId)
		if (room) {
			return room.getParticipant(sessionId)
		}
		console.log(`ROOM NOT FOUND: "${roomId}"`)
		return undefined
	}

	getParticipants(roomId: RoomID): Player[] {
		const room = this.rooms.get(roomId)
		if (room) {
			return room.getPlayers()
		}

		console.log(`ROOM NOT FOUND: "${roomId}"`)
		return []
	}
}
