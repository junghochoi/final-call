import { Action, Player, PlayerInit, RoomID, Stage } from "./common"
import { IndividualGameStateUpdatePayload } from "./server-to-client"

export type PlayerInitializationCallback = (payload: Player) => void
export type IndividualGameStateCallback = (payload: IndividualGameStateUpdatePayload) => void
export interface ClientToServerEvents {
	PlayerInitialization: (payload: PlayerInit, callback: PlayerInitializationCallback) => void
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	PlayerReconnect: (payload: Player) => void
	StageChange: (payload: { roomId: RoomID; stage: Stage }) => void
	GameAction: (payload: { roomId: RoomID; action: Action }) => void
	IndividualGameStateInitialization: (player: Player, callback: IndividualGameStateCallback) => void
	EndRoundAnimation: (payload: { roomId: RoomID }) => void
}
