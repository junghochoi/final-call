export type SessionID = string
export type RoomID = string

export type PlayerInit = {
	nickname: string
	roomId: RoomID
	sessionId: SessionID | undefined
	host: boolean
	socketId: string
}

export type Player = {
	nickname: string
	roomId: RoomID
	sessionId: SessionID
	host: boolean
	socketId: string
}

export type GameState = {
	stage: Stage
	currPlayer: Player | undefined
	players: Player[]
	playerOrder: Player[]
	bidState: BidState | undefined
	auctionState: AuctionState | undefined
	resultState: Map<SessionID, PlayerResultState> | undefined
}

export type PlayerInitializationPayload = {
	playerData: Player
}

export enum Stage {
	Lobby,
	Bidding,
	Auctioning,
	Result,
}

export type Card = {
	value: number
	id: string
	type: CardType
}

export type Action = BidAction | PassAction | SellAction

export type BidAction = {
	name: "bid"
	roomId: RoomID
	player: Player
	amount: number
}

export type PassAction = {
	name: "pass"
	roomId: RoomID
	player: Player
}

export type SellAction = {
	name: "sell"
	roomId: RoomID
	player: Player
	property: Card
}

export type BidStateSerialized = {
	round: number
	roundCards: Card[]
	playerBids: [string, number][]
	playerPropertyCards: [string, Card[]][]
	playerTurn: number
	endRoundAnimate: boolean
}

export type BidState = {
	round: number
	roundCards: Card[]
	playerBids: Map<SessionID, number>
	playerTurn: number
	endRoundAnimate: boolean
}

export type AuctionStateSerialized = {
	round: number
	roundCards: Card[]
	playerPropertyCards: [SessionID, Card[]][]
	playerSellingPropertyCard: [SessionID, Card][]
	playerCashCards: [SessionID, Card[]][]
	endRoundAnimate: boolean
}

export type AuctionState = {
	round: number
	roundCards: Card[]
	playerPropertyCards: Map<SessionID, Card[]>
	playerSellingPropertyCard: Map<SessionID, Card>
	playerCashCards: Map<SessionID, Card[]>
	endRoundAnimate: boolean
}

export type PlayerResultState = {
	bank: number
	cashCards: Card[]
}

export type ResultStateSerialized = [SessionID, PlayerResultState][]

export enum Sound {
	Bet,
	Win,
	Pass,
	PlacingCard,
	EndAuction,
}

export enum CardType {
	Property,
	Cash,
}
