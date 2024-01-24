import { Player, SessionID, BidStateSerialized, IndividualBidState } from "@final-call/shared"
import { shuffle } from "./lib/utils"

export class BidStateManager {
	private allCards: number[]
	private roundCards: number[]

	private round: number
	private playerTurn: number
	private playerOrder: Player[]
	private playerBanks: Map<SessionID, number>
	private playerBids: Map<SessionID, number>
	private playerPropertyCards: Map<SessionID, number[]>

	private numPlayersPassed: number
	private playersPassed: Map<SessionID, boolean>

	constructor() {
		this.allCards = []
		this.roundCards = []
		this.round = 0
		this.playerTurn = 0
		this.playerOrder = []
		this.playerBanks = new Map()
		this.playerBids = new Map()
		this.playerPropertyCards = new Map()

		this.numPlayersPassed = 0
		this.playersPassed = new Map()
	}

	initialize(players: Player[]) {
		this.allCards = this.#createDeck(30)
		this.roundCards = this.#drawCards(6)
		this.round = 0
		this.playerTurn = 0
		this.playerOrder = shuffle(players)
		this.playerBanks = new Map(players.map((player) => [player.sessionId, 14]))
		this.playerBids = new Map(players.map((player) => [player.sessionId, 0]))
		this.playerPropertyCards = new Map(players.map((player) => [player.sessionId, []]))

		this.numPlayersPassed = 0
		this.playersPassed = new Map(players.map((player) => [player.sessionId, false]))
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
			playerTurn: this.playerTurn,
			roundCards: this.roundCards,
			playerOrder: this.playerOrder,
			playerBids: [...this.playerBids.entries()],
			playerPropertyCards: [...this.playerPropertyCards.entries()],
		}
	}
	getIndividualBidState(sessionId: SessionID): IndividualBidState {
		const bank = this.playerBanks.get(sessionId)
		const propertyCards = this.playerPropertyCards.get(sessionId)

		return {
			name: "bid",
			bank: bank!,
			propertyCards: propertyCards!,
		}
	}

	makePlayerPass(player: Player) {
		this.numPlayersPassed += 1
		this.playersPassed.set(player.sessionId, true)

		const propertyCard = this.roundCards.pop()
		const playerPropertyHand = this.playerPropertyCards.get(player.sessionId)

		if (propertyCard === undefined || playerPropertyHand === undefined) {
			return false
		}

		playerPropertyHand.push(propertyCard!)
		this.playerPropertyCards.set(player.sessionId, playerPropertyHand)
		this.playerTurn = (this.playerTurn + 1) % this.playerOrder.length

		return true
	}

	makePlayerBid(player: Player, amount: number) {
		const sessionId = player.sessionId
		const bank = this.playerBanks.get(sessionId)
		if (bank === undefined || amount > bank) {
			return false
		}

		this.playerBanks.set(sessionId, bank - amount)
		this.playerBids.set(sessionId, amount)
		this.playerTurn = (this.playerTurn + 1) % this.playerOrder.length

		return true
	}

	// Helper Functions
	#createDeck(numCards: number) {
		return shuffle(Array.from({ length: numCards }, (_, index) => index + 1))
	}
	#drawCards(numCards: number) {
		const cards = this.allCards.splice(-numCards).sort((a, b) => b - a)
		console.log(cards)
		return cards
	}
}
