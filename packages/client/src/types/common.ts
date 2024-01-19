export type SessionID = string
export type RoomID = string

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
	bidState: ClientBidState | undefined
}

export type PlayerInitializationPayload = {
	sessionId: string
	playerData?: Player
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

export type ClientBidState = {
	round: number
	players: Player[]
	// playerBanks: Map<SessionID, number> Client does not have access to playerBanks
	currentBids: Map<SessionID, number>
	turn: number
}
