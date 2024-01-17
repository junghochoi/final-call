export type SessionID = string
export type RoomID = string

export type Player = {
	nickname: string
	roomId: RoomID
	sessionId: SessionID
	host: boolean
	socketId: string
}

export type InternalGameState = {}

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
	player: Player
}

export type BidState = {
	round: number
	players: Player[]
	turn: number
}
