import { Player, SessionID, BidStateSerialized } from "@final-call/shared"
import { shuffle } from "./lib/utils"

export class BidStateManager {
	private allCards: number[]
	private roundCards: number[]

	private round: number
	private playerTurn: number
	private playerOrder: Player[]
	private playerBanks: Map<SessionID, number>
	private playerBids: Map<SessionID, number>

	constructor() {
		this.allCards = []
		this.roundCards = []
		this.round = 0
		this.playerTurn = 0
		this.playerOrder = []
		this.playerBanks = new Map()
		this.playerBids = new Map()
	}

	initialize(players: Player[]) {
		this.allCards = this.#createDeck(30)
		this.roundCards = this.#drawCards(6)
		this.round = 0
		this.playerTurn = 0
		this.playerOrder = shuffle(players)
		this.playerBanks = new Map(players.map((player) => [player.sessionId, 14]))
		this.playerBids = new Map(players.map((player) => [player.sessionId, 0]))
	}

	/*
export type ServerBidState = {
	round: number
	players: Player[]
	playerBanks: Map<SessionID, number> // Client does not have access to playerBanks
	currentBids: Map<SessionID, number>
	turn: number
}
	*/

	getBidState(): BidStateSerialized {
		return {
			round: this.round,
			roundCards: this.roundCards,
			playerOrder: this.playerOrder,
			playerBids: [...this.playerBids.entries()],
			playerTurn: this.playerTurn,
		}
	}

	makePlayerBid(player: Player, amount: number) {
		const sessionId = player.sessionId
		const bank = this.playerBanks.get(sessionId)
		if (bank === undefined || amount > bank) {
			return false
		}

		this.playerBanks.set(sessionId, bank - amount)
		this.playerBids.set(sessionId, amount)

		return true
	}

	// Helper Functions
	#createDeck(numCards: number) {
		return shuffle(Array.from({ length: numCards }, (_, index) => index + 1))
	}
	#drawCards(numCards: number) {
		return this.allCards.splice(-numCards)
	}
}
