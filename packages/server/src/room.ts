import {
	GameStateUpdatePayload,
	IndividualGameStateUpdatePayload,
	Player,
	Property,
	RoomID,
	SessionID,
	Stage,
} from "@final-call/shared"
import { BidStateManager } from "./bidStateManager"
import { AuctionStateManager } from "./auctionStateManager"

export class Room {
	private roomId: RoomID
	private players: Map<SessionID, Player>
	private stage: Stage

	private bidStateManager: BidStateManager
	private auctionStateManager: AuctionStateManager

	constructor(roomId: string) {
		this.roomId = roomId
		this.players = new Map()
		this.stage = Stage.Lobby

		this.bidStateManager = new BidStateManager()
		this.auctionStateManager = new AuctionStateManager()
	}

	getGameState(): GameStateUpdatePayload {
		return {
			roomId: this.roomId,
			players: this.getPlayers(),
			stage: this.stage,
			bidState: this.bidStateManager.getBidState(),
			auctionState: this.auctionStateManager.getAuctionState(),
		}
	}
	getIndividualGameState(sessionId: SessionID): IndividualGameStateUpdatePayload {
		// return this.bidStateManager.getIndividualBidState(sessionId)
		if (this.stage === Stage.Bidding) {
			return this.bidStateManager.getIndividualBidState(sessionId)
		} else {
			return this.auctionStateManager.getIndividualAuctionState(sessionId)
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
			this.bidStateManager.initialize(Array.from(this.players.values()))
		} else if (stage == Stage.Auctioning) {
			console.log("STAGE CHANGING TO AUCTIONING")
			const propertyCards = new Map(this.bidStateManager.getBidState().playerPropertyCards)

			this.bidStateManager = new BidStateManager()
			this.auctionStateManager.initialize(Array.from(this.players.values()), propertyCards)
		} else if (stage == Stage.Result) {
			this.auctionStateManager = new AuctionStateManager()
			// Deinitialize AuctionState
			// Initialize Results Page
		}
		this.stage = stage
	}

	makePlayerBid(sessionId: SessionID, amount: number): boolean {
		const player = this.getParticipant(sessionId)

		if (!player) return false

		return this.bidStateManager.makePlayerBid(player, amount)
	}

	makePlayerPass(sessionId: SessionID) {
		const player = this.getParticipant(sessionId)

		if (!player) return false

		const playerPassSuccessful = this.bidStateManager.makePlayerPass(player)

		// if (this.bidStateManager.isGameOver()) {
		// 	this.changeStage(Stage.Auctioning) // Changing state causes IndividualGameState to send an Auction Individual Game State instead of a BidGameState
		// }

		return playerPassSuccessful
	}

	makePlayerSell(sessionId: SessionID, property: Property) {
		const player = this.getParticipant(sessionId)

		if (!player) return false

		return this.auctionStateManager.makePlayerSellProperty(sessionId, property)
	}

	needToChangeStage(): Stage | undefined {
		if (this.bidStateManager.isGameOver()) {
			console.log("changing to aucitoning")
			return Stage.Auctioning
		} else if (this.auctionStateManager.isGameOver()) {
			return Stage.Result
		}

		return undefined
	}
}
