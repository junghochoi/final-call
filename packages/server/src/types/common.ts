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
	player: Player
}

export type PassAction = {
	player: Player
}

export type BidState = {
	round: number
	players: Player[]
	playerBanks: Map<SessionID, number>
	turn: number
}
