import { BidState, GameStateUpdatePayload, Player, RoomID, SessionID, Stage } from "./types"
import { shuffle } from "./lib/utils"

export class Room {
	private roomId: RoomID
	private players: Map<SessionID, Player>
	private stage: Stage
	private bidState: BidState | null

	constructor(roomId: string) {
		this.roomId = roomId
		this.players = new Map()
		this.stage = Stage.Lobby

		this.bidState = null
	}

	getGameState(): GameStateUpdatePayload {
		return {
			roomId: this.roomId,
			players: this.getPlayers(),
			stage: this.stage,
		}
	}

	getRoomId(): string {
		return this.roomId
	}

	addPlayer(user: Player): void {
		console.log(this.getPlayerCount())
		if (this.getPlayerCount() === 0) {
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

	changeStage(stage: Stage) {
		if (stage == Stage.Bidding) {
			// Initialize BidState
			this.bidState = {
				round: 0,
				players: shuffle(Array.from(this.players.values())),
				playerBanks: new Map(Array.from(this.players.keys()).map((key) => [key, 14])),
				turn: Math.floor(Math.random() * this.players.size),
			}
		} else if (stage == Stage.Auctioning) {
			// Deinitialize Bidstate
			// Initialize AuctionState
		} else if (stage == Stage.Result) {
			// Deinitialize AuctionState
			// Initialize Results Page
		}
		this.stage = stage
	}
}
