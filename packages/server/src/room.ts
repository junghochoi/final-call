import { Player, RoomID, SessionID } from "./types"

export class Room {
	private roomId: RoomID
	private players: Map<SessionID, Player>

	constructor(roomId: string) {
		this.roomId = roomId
		this.players = new Map()
	}

	getRoomId(): string {
		return this.roomId
	}

	addPlayer(user: Player): void {
		this.players.set(user.sessionId, user)
	}

	removePlayer(sessionId: SessionID): void {
		this.players.delete(sessionId)
	}

	getPlayerCount(): number {
		return this.players.size
	}
	getPlayers(): Player[] {
		return Array.from(this.players.values())
	}
	hasParticipant(sessionId: SessionID): boolean {
		return this.players.has(sessionId)
	}
	getParticipant(sessionId: SessionID): Player | undefined {
		return this.players.get(sessionId)
	}
}
