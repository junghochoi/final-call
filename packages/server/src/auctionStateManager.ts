import {
	Player,
	SessionID,
	IndividualAuctionStateUploadPayload,
	AuctionStateSerialized,
	Stage,
} from "@final-call/shared"
import { shuffle } from "./lib/utils"

export class AuctionStateMangager {
	private deckSize: number
	private numPlayers: number
	private allCards: number[]
	private roundCards: number[]

	private round: number

	private playerCashCards: Map<SessionID, number[]>
	private playerPropertyCards: Map<SessionID, number[]>
	private playerSellingPropertyCard: Map<SessionID, number>

	constructor() {
		this.numPlayers = 0
		this.allCards = []
		this.roundCards = []
		this.round = 0

		this.playerPropertyCards = new Map()
		this.playerCashCards = new Map()
		this.playerSellingPropertyCard = new Map()
		this.deckSize = 0
	}

	initialize(players: Player[], playerPropertyCards: Map<SessionID, number[]>) {
		this.deckSize = 6
		this.numPlayers = players.length
		this.allCards = this.#createDeck(this.deckSize)
		this.roundCards = this.#drawCards(players.length)
		this.round = 0
		this.playerPropertyCards = playerPropertyCards
		this.playerCashCards = new Map(players.map((player) => [player.sessionId, []]))
	}

	getAuctionState(): AuctionStateSerialized {
		return {
			round: this.round,
			roundCards: this.roundCards,
			playerPropertyCards: [...this.playerPropertyCards.entries()],
			playerCashCards: [...this.playerCashCards.entries()],
			playerSellingPropertyCard: [...this.playerSellingPropertyCard.entries()],
		}
	}

	getIndividualAuctionState(sessionId: SessionID): IndividualAuctionStateUploadPayload {
		const propertyCards = this.playerPropertyCards.get(sessionId)!
		const cashCards = this.playerCashCards.get(sessionId)!

		return {
			stage: Stage.Auctioning,
			propertyCards,
			cashCards,
		}
	}

	makePlayerSellProperty(sessionId: SessionID, property: number) {
		const propertyCards = this.playerPropertyCards.get(sessionId)!
		const propertyCardsWithRemovedProperty = propertyCards.filter((num) => num !== property)
		this.playerPropertyCards.set(sessionId, propertyCardsWithRemovedProperty)

		this.playerSellingPropertyCard.set(sessionId, property)

		// Check if all players have selected a card
	}

	startNewRound() {}

	#addCashCardToPlayerHand(cashCard: number, sessionId: SessionID) {
		const playerCashCards = this.playerCashCards.get(sessionId)!

		if (playerCashCards === undefined) {
			throw new Error("could not find player in playerPropertyCards")
		}

		playerCashCards.push(cashCard)
		this.playerPropertyCards.set(sessionId, playerCashCards)
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
		return this.round === Math.ceil(this.deckSize / this.numPlayers)
	}
}
