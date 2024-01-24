import { Action, IndividualGameState, Player, PlayerInit, PlayerInitializationPayload, RoomID, Stage } from "./common"

export type PlayerInitializationCallback = (payload: Player) => void
export type IndividualGameStateCallback = (payload: IndividualGameState) => void
export interface ClientToServerEvents {
	PlayerInitialization: (payload: PlayerInit, callback: PlayerInitializationCallback) => void
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	PlayerReconnect: (payload: Player) => void
	StageChange: (payload: { roomId: RoomID; stage: Stage }) => void
	GameAction: (payload: { roomId: RoomID; action: Action }) => void
	IndividualGameState: (player: Player, callback: IndividualGameStateCallback) => void
}
