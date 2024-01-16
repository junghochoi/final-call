import { Socket } from "socket.io"

export type SessionID = string
export type RoomID = string

export type Player = {
	nickname: string
	roomId: RoomID
	sessionId: SessionID
	host: boolean
	// socket: Socket
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
