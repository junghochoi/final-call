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

	private endRoundAnimate: boolean
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

		this.endRoundAnimate = false
	}

	initialize(players: Player[], numRounds: number) {
		let startingMoney = 14
		if (players.length === 2) startingMoney = 24
		if (players.length === 3 || players.length === 4) startingMoney = 18

		let removeCards = 0
		if (players.length === 2) removeCards = 20
		if (players.length === 3) removeCards = 6
		if (players.length === 4) removeCards = 2
		this.deckSize = 30 - removeCards
		this.numPlayers = players.length
		this.allCards = this.#createDeck(30, removeCards)
		this.roundCards = this.#drawCards(players.length)
		this.round = 0
		this.playerOrder = players
		this.playerTurn = 0
		this.playerBanks = new Map(players.map((player) => [player.sessionId, startingMoney]))
		this.playerBids = new Map(players.map((player) => [player.sessionId, 0]))
		this.playerPropertyCards = new Map(players.map((player) => [player.sessionId, []]))

		this.numPlayersPassed = 0
		this.playersPassed = new Map(players.map((player) => [player.sessionId, false]))

		this.endRoundAnimate = false
	}

	getBidState(): BidStateSerialized {
		return {
			round: this.round,
			playerTurn: this.playerTurn,
			roundCards: this.roundCards.sort((a, b) => a - b),
			playerBids: [...this.playerBids.entries()],
			playerPropertyCards: [...this.playerPropertyCards.entries()],
			endRoundAnimate: this.endRoundAnimate,
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

	getAllPlayerBanks(): Map<SessionID, number> {
		return this.playerBanks
	}

	makePlayerBid(player: Player, bid: number) {
		const sessionId = player.sessionId
		const bank = this.playerBanks.get(sessionId)
		const amountPutIn = this.playerBids.get(sessionId) ?? 0

		// Second Condition: If their bid is greater than what they have and what they put in. Return False
		// Third Condition: If their bid is less or equal to the maximum bid
		if (bank === undefined || bid > bank + amountPutIn || bid <= Math.max(...this.playerBids.values())) {
			return false
		}

		this.playerBanks.set(sessionId, bank - (bid - amountPutIn))
		this.playerBids.set(sessionId, bid)
		this.#setNextPlayerTurn()

		return true
	}
	makePlayerPass(player: Player) {
		this.numPlayersPassed += 1
		this.playersPassed.set(player.sessionId, true)

		const propertyCard = this.roundCards.pop()

		if (!propertyCard) {
			return {
				success: false,
				emitGameState: false,
			}
		}

		this.#addPropertyCardToPlayerHand(propertyCard, player.sessionId)
		this.#setNextPlayerTurn()

		if (this.numPlayersPassed === this.numPlayers - 1) {
			this.endRound()

			return {
				success: true,
				emitGameState: true,
			}
		} else {
			const bank = this.playerBanks.get(player.sessionId)!
			const bid = this.playerBids.get(player.sessionId)!
			this.playerBanks.set(player.sessionId, bank + Math.floor(bid / 2))
			this.playerBids.set(player.sessionId, 0)
		}

		return {
			success: true,
			emitGameState: false,
		}
	}

	startNewRound() {
		this.endRoundAnimate = false
		const propertyCard = this.roundCards.pop()
		if (!propertyCard) return false

		const player = this.playerOrder[this.playerTurn]

		this.#addPropertyCardToPlayerHand(propertyCard, player.sessionId)
		this.#setNextPlayerTurn()
		this.startNewRound()

		// Starting New Round - Above code gives card back to last person
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

	endRound() {
		this.endRoundAnimate = true
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

		playerPropertyHand.push(propertyCard)
		this.playerPropertyCards.set(sessionId, playerPropertyHand)
	}
	// Helper Functions
	#createDeck(numCards: number, removeCards: number) {
		return shuffle(Array.from({ length: numCards }, (_, index) => index + 1)).splice(removeCards)
	}
	#drawCards(numCards: number) {
		const cards = this.allCards.splice(-numCards).sort((a, b) => b - a)
		return cards
	}

	isGameOver(): boolean {
		const res = this.round === Math.ceil(this.deckSize / this.numPlayers)
		console.log(this.round, this.deckSize, this.numPlayers)
		return res
	}
}
