import { Player, SessionID, BidStateSerialized, IndividualBidStateUploadPayload, Stage } from "@final-call/shared"
import { shuffle } from "./lib/utils"

export class BidStateManager {
	private numPlayers: number
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
		this.numPlayers = 0
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
		const deckSize = players.length === 2 ? 20 : 30

		this.numPlayers = players.length
		this.allCards = this.#createDeck(deckSize)
		this.roundCards = this.#drawCards(players.length)
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
	getIndividualBidState(sessionId: SessionID): IndividualBidStateUploadPayload {
		const bank = this.playerBanks.get(sessionId)
		const propertyCards = this.playerPropertyCards.get(sessionId)

		return {
			stage: Stage.Bidding,
			bank: bank!,
			propertyCards: propertyCards!,
		}
	}

	makePlayerPass(player: Player) {
		this.numPlayersPassed += 1
		this.playersPassed.set(player.sessionId, true)

		const propertyCard = this.roundCards.pop()

		if (!propertyCard) return false

		this.#addPropertyCardToPlayerHand(propertyCard, player.sessionId)

		this.#setNextPlayerTurn()

		console.log(this.numPlayersPassed)

		if (this.numPlayersPassed === this.numPlayers) {
			// const winnerSessionId = this.playerOrder[this.playerTurn].sessionId
			// const propertyCard = this.roundCards.pop()!

			// this.#addPropertyCardToPlayerHand(propertyCard, winnerSessionId)

			this.startNewRound()
		}

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
}
