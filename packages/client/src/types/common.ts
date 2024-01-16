export type SessionID = string
export type RoomID = string

export type Player = {
	nickname: string
	socketId: string
	roomId: RoomID
	sessionId: SessionID
	host: boolean
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
