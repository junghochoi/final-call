import { GameStateUpdatePayload, Player, RoomID, SessionID, Stage } from "@final-call/shared"
import { shuffle } from "./lib/utils"

export class Room {
	private roomId: RoomID
	private players: Map<SessionID, Player>
	private stage: Stage
	// private bidState: ServerBidState | null

	constructor(roomId: string) {
		this.roomId = roomId
		this.players = new Map()
		this.stage = Stage.Lobby

		// this.bidState = null
	}

	getGameState(): GameStateUpdatePayload {
		return {
			roomId: this.roomId,
			players: this.getPlayers(),
			stage: this.stage,
			// bidState: this.bidState,
		}
	}

	getRoomId(): string {
		return this.roomId
	}

	addPlayer(user: Player): void {
		if (this.getPlayerCount() === 0) {
			console.log("setting host")
			user.host = true
		}
		this.players.set(user.sessionId, user)
	}

	removePlayer(sessionId: SessionID): void {
		console.log(`removing ${sessionId}`)
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

			const sessionids: SessionID[] = Array.from(this.players.keys())

			// this.bidState = {
			// 	round: 0,
			// 	players: shuffle(Array.from(this.players.values())),
			// 	playerBanks: new Map(sessionids.map((key) => [key, 14])),
			// 	currentBids: new Map(sessionids.map((key) => [key, 0])),
			// 	turn: Math.floor(Math.random() * this.players.size),
			// }
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
