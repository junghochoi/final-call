import {
	Player,
	SessionID,
	IndividualAuctionStateUploadPayload,
	AuctionStateSerialized,
	Stage,
} from "@final-call/shared"
import { shuffle, zip } from "./lib/utils"

export type UpdateInfo = {
	success: boolean
	submitAllIndividualStates: boolean
}

export class AuctionStateManager {
	private deckSize: number
	private playerOrder: Player[]
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
		this.playerOrder = []
		this.playerPropertyCards = new Map()
		this.playerCashCards = new Map()
		this.playerSellingPropertyCard = new Map()
		this.deckSize = 0
	}

	initialize(playerOrder: Player[], playerPropertyCards: Map<SessionID, number[]>) {
		this.deckSize = 6
		this.numPlayers = playerOrder.length
		this.playerOrder = playerOrder
		this.allCards = this.#createDeck(this.deckSize)
		this.roundCards = this.#drawCards(playerOrder.length)
		this.round = 0
		this.playerPropertyCards = playerPropertyCards
		this.playerCashCards = new Map(playerOrder.map((player) => [player.sessionId, []]))
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
		const propertyCards = this.playerPropertyCards.get(sessionId)
		const cashCards = this.playerCashCards.get(sessionId)

		console.log("Call from getIndividualAuctionState", this.playerPropertyCards)

		return {
			stage: Stage.Auctioning,
			propertyCards: propertyCards!,
			cashCards: cashCards!,
		}
	}

	makePlayerSellProperty(sessionId: SessionID, property: number): UpdateInfo {
		console.log("Call from makeSellProperty", this.playerPropertyCards)
		const propertyCards = this.playerPropertyCards.get(sessionId)!
		const propertyCardsWithRemovedProperty = propertyCards.filter((num) => num !== property)
		this.playerPropertyCards.set(sessionId, propertyCardsWithRemovedProperty)

		this.playerSellingPropertyCard.set(sessionId, property)

		if (this.playerSellingPropertyCard.size === this.numPlayers) {
			const playersOrdered = [...this.playerSellingPropertyCard.entries()].sort((a, b) => a[1] - b[1]).map((a) => a[0])
			const cashCardsOrdered = this.roundCards.sort((a, b) => a - b)

			const assignments = zip(playersOrdered, cashCardsOrdered)

			console.log(assignments)

			assignments.forEach((pair) => {
				const userId = pair[0]
				const cashCard = pair[1]

				this.#addCashCardToPlayerHand(cashCard, userId)
			})

			// this.playerSellingPropertyCard.clear()
			return {
				success: true,
				submitAllIndividualStates: true,
			}
		}

		return {
			success: true,
			submitAllIndividualStates: false,
		}
	}

	startNewRound() {}

	#addCashCardToPlayerHand(cashCard: number, sessionId: SessionID) {
		const cashCards = this.playerCashCards.get(sessionId)!

		if (cashCards === undefined) {
			throw new Error("could not find player in playerPropertyCards")
		}

		cashCards.push(cashCard)
		this.playerCashCards.set(sessionId, cashCards)
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
		return this.round === this.numPlayers && this.round !== 0
	}
}
