import { Player, PlayerInitializationPayload } from "./common"

export type GameStateUpdatePayload = {
	roomId: string
	participants: Player[]
}

export interface ServerToClientEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	GameStateUpdate: (payload: GameStateUpdatePayload) => void
	PlayerInitialization: (payload: PlayerInitializationPayload) => void
}
