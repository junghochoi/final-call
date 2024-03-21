import {
	Player,
	SessionID,
	IndividualAuctionStateUploadPayload,
	AuctionStateSerialized,
	Stage,
	Card,
	CardType,
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
	private allCards: Card[]
	private roundCards: Card[]

	private round: number

	private playerBanks: Map<SessionID, number>
	private playerCashCards: Map<SessionID, Card[]>
	private playerPropertyCards: Map<SessionID, Card[]>
	private playerSellingPropertyCard: Map<SessionID, Card>
	private endRoundAnimate: boolean

	constructor() {
		this.numPlayers = 0
		this.allCards = []
		this.roundCards = []
		this.round = 0
		this.playerOrder = []
		this.playerBanks = new Map()
		this.playerPropertyCards = new Map()
		this.playerCashCards = new Map()
		this.playerSellingPropertyCard = new Map()
		this.deckSize = 0
		this.endRoundAnimate = false
	}

	initialize(
		playerOrder: Player[],
		numRounds: number,
		playerPropertyCards: Map<SessionID, Card[]>,
		playerBanks: Map<SessionID, number>
	) {
		let removeCards = 0

		if (playerOrder.length === 2) removeCards = 20
		if (playerOrder.length === 3) removeCards = 6
		if (playerOrder.length === 4) removeCards = 2

		this.deckSize = 30 - removeCards
		this.numPlayers = playerOrder.length
		this.playerOrder = playerOrder
		this.allCards = this.#createDeck(this.deckSize, removeCards)
		this.roundCards = this.#drawCards(playerOrder.length)
		this.round = 0
		this.playerPropertyCards = playerPropertyCards
		this.playerCashCards = new Map(playerOrder.map((player) => [player.sessionId, []]))
		this.playerBanks = playerBanks
	}

	getAuctionState(): AuctionStateSerialized {
		return {
			round: this.round,
			totalNumRounds: Math.ceil(this.deckSize / this.numPlayers),
			roundCards: this.roundCards,
			playerPropertyCards: [...this.playerPropertyCards.entries()],
			playerCashCards: [...this.playerCashCards.entries()],
			playerSellingPropertyCard: [...this.playerSellingPropertyCard.entries()],
			endRoundAnimate: this.endRoundAnimate,
		}
	}

	getIndividualAuctionState(sessionId: SessionID): IndividualAuctionStateUploadPayload {
		const propertyCards = this.playerPropertyCards.get(sessionId)
		const cashCards = this.playerCashCards.get(sessionId)

		return {
			stage: Stage.Auctioning,
			bank: this.playerBanks.get(sessionId) ?? -1,
			propertyCards: propertyCards ?? [],
			cashCards: cashCards ?? [],
		}
	}

	makePlayerSellProperty(sessionId: SessionID, property: Card): UpdateInfo {
		const propertyCards = this.playerPropertyCards.get(sessionId)!
		const propertyCardsWithRemovedProperty = propertyCards.filter((card) => card.value !== property.value)
		this.playerPropertyCards.set(sessionId, propertyCardsWithRemovedProperty)

		this.playerSellingPropertyCard.set(sessionId, property)

		if (this.playerSellingPropertyCard.size === this.numPlayers) {
			const playersOrdered = [...this.playerSellingPropertyCard.entries()]
				.sort((a, b) => a[1].value - b[1].value)
				.map((a) => a[0])
			const cashCardsOrdered = this.roundCards.sort((a, b) => a.value - b.value)

			const assignments = zip(playersOrdered, cashCardsOrdered)

			assignments.forEach((pair) => {
				const userId: string = pair[0]
				const cashCard: Card = pair[1]

				this.#addCashCardToPlayerHand(cashCard, userId)
			})

			this.endRoundAnimate = true

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

	startNewRound() {
		this.endRoundAnimate = false
		if (!this.isGameOver()) {
			this.roundCards = this.#drawCards(this.playerOrder.length)
			console.log(this.roundCards)

			this.round += 1
			this.playerSellingPropertyCard.clear()
		}
	}

	#addCashCardToPlayerHand(cashCard: Card, sessionId: SessionID) {
		console.log(cashCard)
		const cashCards = this.playerCashCards.get(sessionId)!
		if (cashCards === undefined) {
			throw new Error("could not find player in playerPropertyCards")
		}

		console.log("OVER HERE", cashCard)
		cashCards.push(cashCard)
		this.playerCashCards.set(sessionId, cashCards)
	}
	// Helper Functions
	#createDeck(numCards: number, removeCards: number): Card[] {
		// return shuffle(Array.from({ length: numCards }, (_, index) => index + 1))
		return shuffle(
			Array.from({ length: Math.floor(15) }, (_, index) => [
				{
					value: index + 1,
					id: `${index}_C1`,
					type: CardType.Cash,
				},
				{ value: index + 1, id: `${index}_C2`, type: CardType.Cash },
			])
				.flat()
				.splice(removeCards)
		)
	}
	#drawCards(numCards: number): Card[] {
		const cards = this.allCards.splice(-numCards).sort((a, b) => b.value - a.value)
		return cards
	}

	isGameOver(): boolean {
		// return this.round + 1 === this.numPlayers && this.round !== 0

		return this.round === Math.ceil(this.deckSize / this.numPlayers)
	}
}
