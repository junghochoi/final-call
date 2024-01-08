import { Socket } from "socket.io"

export type SessionID = string
export type RoomID = string

export type Player = {
	nickname: string
	socket: Socket
	roomId: RoomID
	sessionId: SessionID
}

export type PlayerInitializationPayload = {
	sessionId: string
	playerData?: Player
}
