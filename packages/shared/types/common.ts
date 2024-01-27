export type SessionID = string
export type RoomID = string

export type Property = number
export type Cash = number

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
	property: Property
}

export type BidStateSerialized = {
	round: number
	roundCards: number[]
	playerBids: [string, number][]
	playerPropertyCards: [string, number[]][]
	playerTurn: number
}

export type BidState = {
	round: number
	roundCards: number[]
	playerBids: Map<SessionID, number>
	playerTurn: number
}

export type AuctionStateSerialized = {
	round: number
	roundCards: number[]
	playerPropertyCards: [SessionID, number[]][]
	playerSellingPropertyCard: [SessionID, number][]
	playerCashCards: [SessionID, number[]][]
}

export type AuctionState = {
	round: number
	roundCards: number[]
	playerPropertyCards: Map<SessionID, number[]>
	playerSellingPropertyCard: Map<SessionID, number>
	playerCashCards: Map<SessionID, number[]>
}
