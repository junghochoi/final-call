import { Action, Player, PlayerInit, RoomID, Stage } from "./common"
import { IndividualGameStateUpdatePayload } from "./server-to-client"

export type CanPlayerJoinCallback = (data: { error: boolean; message: string }) => void
export type PlayerInitializationCallback = (payload: Player) => void
export type IndividualGameStateCallback = (payload: IndividualGameStateUpdatePayload) => void
export interface ClientToServerEvents {
	PlayerInitialization: (payload: PlayerInit, callback: PlayerInitializationCallback) => void
	CanPlayerJoin: (roomId: RoomID, callback: CanPlayerJoinCallback) => void
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	PlayerReconnect: (payload: Player) => void
	StageChange: (payload: { roomId: RoomID; stage: Stage }) => void
	GameAction: (payload: { roomId: RoomID; action: Action }) => void
	IndividualGameStateInitialization: (player: Player, callback: IndividualGameStateCallback) => void
}
