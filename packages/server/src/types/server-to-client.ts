import { Player, Stage, PlayerInitializationPayload } from "./common"

export type GameStateUpdatePayload = {
	roomId: string
	players: Player[]
	stage: Stage
}

export interface ServerToClientEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	GameStateUpdate: (payload: GameStateUpdatePayload) => void
	PlayerInitialization: (payload: PlayerInitializationPayload) => void
}
