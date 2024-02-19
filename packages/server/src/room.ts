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
import { AuctionStateManager, UpdateInfo } from "./auctionStateManager"
import { shuffle } from "./lib/utils"

type ResultState = {
	bank: number
	cashCards: number[]
}

export class Room {
	private roomId: RoomID
	private players: Map<SessionID, Player>
	private playerOrder: Player[]
	private stage: Stage

	private bidStateManager: BidStateManager
	private auctionStateManager: AuctionStateManager
	private resultState: Map<SessionID, ResultState>

	constructor(roomId: string) {
		this.roomId = roomId
		this.players = new Map()
		this.stage = Stage.Lobby

		this.bidStateManager = new BidStateManager()
		this.auctionStateManager = new AuctionStateManager()
		this.resultState = new Map()
		this.playerOrder = []
	}

	getGameState(): GameStateUpdatePayload {
		return {
			roomId: this.roomId,
			players: this.getPlayers(),
			playerOrder: this.playerOrder,
			stage: this.stage,
			bidState: this.bidStateManager.getBidState(),
			auctionState: this.auctionStateManager.getAuctionState(),
			resultState: [...this.resultState.entries()],
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

	makePlayerBid(sessionId: SessionID, amount: number): boolean {
		const player = this.getParticipant(sessionId)

		if (!player) return false

		return this.bidStateManager.makePlayerBid(player, amount)
	}

	makePlayerPass(sessionId: SessionID) {
		const player = this.getParticipant(sessionId)

		if (!player) return { success: false, emitGameState: false }

		return this.bidStateManager.makePlayerPass(player)
	}

	makePlayerSell(sessionId: SessionID, property: Property): UpdateInfo {
		const player = this.getParticipant(sessionId)

		if (!player) return { success: false, submitAllIndividualStates: false }

		return this.auctionStateManager.makePlayerSellProperty(sessionId, property)
	}

	startNewBiddingRound() {
		this.bidStateManager.startNewRound()
	}

	changeStage(stage: Stage) {
		if (stage == Stage.Bidding) {
			this.playerOrder = Array.from(this.players.values()).sort((a, b) => a.nickname.localeCompare(b.nickname))
			this.bidStateManager.initialize(this.playerOrder)
		} else if (stage == Stage.Auctioning) {
			// Obtain all the Result States from the Bank Stage
			this.playerOrder.forEach((player: Player) => {
				const individualBidState = this.bidStateManager.getIndividualBidState(player.sessionId)
				this.resultState.set(player.sessionId, {
					bank: individualBidState.bank,
					cashCards: [],
				})
			})

			const propertyCards = new Map(this.bidStateManager.getBidState().playerPropertyCards)

			// Deinitialize BidState
			this.bidStateManager = new BidStateManager()
			this.auctionStateManager.initialize(this.playerOrder, propertyCards)
		} else if (stage == Stage.Result) {
			this.playerOrder.forEach((player: Player) => {
				const individualAuctionState = this.auctionStateManager.getIndividualAuctionState(player.sessionId)
				this.resultState.set(player.sessionId, {
					bank: this.resultState.get(player.sessionId)?.bank!,
					cashCards: individualAuctionState.cashCards,
				})
			})
			this.auctionStateManager = new AuctionStateManager()
		} else if (stage === Stage.Lobby) {
			this.bidStateManager = new BidStateManager()
			this.auctionStateManager = new AuctionStateManager()
		}
		this.stage = stage
	}

	needToChangeStage(): Stage | undefined {
		console.log("Checking Stage Change for Bidding")
		if (this.stage == Stage.Bidding && this.bidStateManager.isGameOver()) {
			return Stage.Auctioning
		}

		console.log("Checking Stage Change for Auctioning")
		if (this.stage == Stage.Auctioning && this.auctionStateManager.isGameOver()) {
			return Stage.Result
		}

		return undefined
	}
}
