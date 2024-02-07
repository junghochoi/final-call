import { Player, SessionID, BidStateSerialized, IndividualBidStateUploadPayload, Stage } from "@final-call/shared"
import { shuffle } from "./lib/utils"

export class BidStateManager {
	private deckSize: number
	private numPlayers: number
	private allCards: number[]
	private roundCards: number[]

	private playerOrder: Player[]
	private round: number
	private playerTurn: number
	private playerBanks: Map<SessionID, number>
	private playerBids: Map<SessionID, number>
	private playerPropertyCards: Map<SessionID, number[]>

	private numPlayersPassed: number
	private playersPassed: Map<SessionID, boolean>
	constructor() {
		this.numPlayers = 0
		this.allCards = []
		this.roundCards = []
		this.round = 0
		this.playerTurn = 0
		this.playerBanks = new Map()
		this.playerBids = new Map()
		this.playerPropertyCards = new Map()
		this.deckSize = 0
		this.playerOrder = []

		this.numPlayersPassed = 0
		this.playersPassed = new Map()
	}

	initialize(players: Player[]) {
		this.deckSize = 6
		this.numPlayers = players.length
		this.allCards = this.#createDeck(this.deckSize)
		this.roundCards = this.#drawCards(players.length)
		this.round = 0
		this.playerOrder = players
		this.playerTurn = 0
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
			playerBids: [...this.playerBids.entries()],
			playerPropertyCards: [...this.playerPropertyCards.entries()],
		}
	}
	getIndividualBidState(sessionId: SessionID): IndividualBidStateUploadPayload {
		const bank = this.playerBanks.get(sessionId)!
		const propertyCards = this.playerPropertyCards.get(sessionId)!

		return {
			stage: Stage.Bidding,
			bank: bank,
			propertyCards: propertyCards,
		}
	}

	makePlayerPass(player: Player) {
		this.numPlayersPassed += 1
		this.playersPassed.set(player.sessionId, true)

		const propertyCard = this.roundCards.pop()

		if (!propertyCard) return false

		this.#addPropertyCardToPlayerHand(propertyCard, player.sessionId)
		this.#setNextPlayerTurn()

		if (this.numPlayersPassed === this.numPlayers) {
			this.startNewRound()
		} else {
			const bank = this.playerBanks.get(player.sessionId)!
			const bid = this.playerBids.get(player.sessionId)!
			this.playerBanks.set(player.sessionId, bank + Math.floor(bid / 2))
			this.playerBids.set(player.sessionId, 0)
		}

		return true
	}

	makePlayerBid(player: Player, bid: number) {
		const sessionId = player.sessionId
		const bank = this.playerBanks.get(sessionId)
		const amountPutIn = this.playerBids.get(sessionId) ?? 0

		if (bank === undefined || bid > bank + amountPutIn) {
			return false
		}

		this.playerBanks.set(sessionId, bank - (bid - amountPutIn))
		this.playerBids.set(sessionId, bid)
		this.#setNextPlayerTurn()

		return true
	}

	startNewRound() {
		this.roundCards = this.#drawCards(this.playerOrder.length)

		this.round += 1
		this.numPlayersPassed = 0

		Array.from(this.playerBids.keys()).forEach((key) => {
			this.playerBids.set(key, 0)
		})

		Array.from(this.playersPassed.keys()).forEach((key) => {
			this.playersPassed.set(key, false)
		})
	}

	#setNextPlayerTurn() {
		let originalPlayerTurn = this.playerTurn
		let nextPlayerTurn = (this.playerTurn + 1) % this.numPlayers
		while (this.playersPassed.get(this.playerOrder[nextPlayerTurn].sessionId)) {
			if (originalPlayerTurn === nextPlayerTurn) {
				break
			}

			nextPlayerTurn = (nextPlayerTurn + 1) % this.numPlayers
		}

		this.playerTurn = nextPlayerTurn
	}

	#addPropertyCardToPlayerHand(propertyCard: number, sessionId: SessionID) {
		const playerPropertyHand = this.playerPropertyCards.get(sessionId)

		if (playerPropertyHand === undefined) {
			throw new Error("could not find player in playerPropertyCards")
		}

		playerPropertyHand.push(propertyCard!)
		this.playerPropertyCards.set(sessionId, playerPropertyHand)
	}
	// Helper Functions
	#createDeck(numCards: number) {
		return shuffle(Array.from({ length: numCards }, (_, index) => index + 1))
	}
	#drawCards(numCards: number) {
		const cards = this.allCards.splice(-numCards).sort((a, b) => b - a)
		return cards
	}

	isGameOver(): boolean {
		const res = this.round === Math.ceil(this.deckSize / this.numPlayers)
		return res
	}
}
