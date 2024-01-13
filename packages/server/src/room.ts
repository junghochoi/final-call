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
		console.log("Adding Player")
		console.log(this.getPlayerCount())
		if (this.getPlayerCount() === 0) {
			console.log("setting host")
			user.host = true
		}
		this.players.set(user.sessionId, user)
	}

	removePlayer(sessionId: SessionID): void {
		const needNewHost = this.players.get(sessionId)?.host
		const removed = this.players.delete(sessionId)

		if (needNewHost && removed && this.getPlayerCount() > 0) {
			const [id, player] = this.players.entries().next().value
			player.host = true
			this.players.set(id, player)
		}
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
