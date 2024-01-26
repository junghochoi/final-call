import {
	Player,
	SessionID,
	BidStateSerialized,
	IndividualBidStateUploadPayload,
	Stage,
	AuctionStateSerialized,
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

	constructor() {
		this.numPlayers = 0
		this.allCards = []
		this.roundCards = []
		this.round = 0

		this.playerPropertyCards = new Map()
		this.playerCashCards = new Map()
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

	/*
export type ServerBidState = {
	round: number
	players: Player[]
	playerBanks: Map<SessionID, number> // Client does not have access to playerBanks
	currentBids: Map<SessionID, number>
	turn: number
}
	*/

	getAuctionState(): AuctionStateSerialized {}
	getIndividualAuctionState(sessionId: SessionID): IndividualAuctionStateUploadPayload {}

	makePlayerSellProperty(property: number) {}

	startNewRound() {}

	#addCashCardToPlayerHand(cashCard: number, sessionId: SessionID) {
		const playerCashCards = this.playerCashCards.get(sessionId)

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
