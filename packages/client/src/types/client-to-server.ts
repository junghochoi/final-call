import { Action, Player, RoomID, Stage } from "./common"

export interface ClientToServerEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	PlayerReconnect: (payload: Player) => void
	StageChange: (payload: { roomId: RoomID; stage: Stage }) => void

	GameAction: (payload: { roomId: RoomID; player: Player; action: Action }) => void
	// Bid: (payload: { player: Player; amount: number }) => void
}
