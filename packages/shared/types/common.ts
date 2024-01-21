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
	bidState: BidState | undefined
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

export type Action = BidAction | PassAction

export type BidAction = {
	roomId: RoomID
	player: Player
	amount: number
}

export type PassAction = {
	roomId: RoomID
	player: Player
}

export type BidState = {
	round: number
	roundCards: number[]
	playerOrder: Player[]
	playerBids: Map<SessionID, number>
	playerTurn: number
}

// export type ServerBidState = {
// 	round: number
// 	players: Player[]
// 	playerBanks: Map<SessionID, number> // Client does not have access to playerBanks
// 	currentBids: Map<SessionID, number>
// 	turn: number
// }
