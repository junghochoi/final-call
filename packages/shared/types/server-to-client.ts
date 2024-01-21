import { Player, Stage, PlayerInitializationPayload, SessionID, BidState, BidAction } from "./common"

export type GameStateUpdatePayload = {
	roomId: string
	players: Player[]
	stage: Stage
	bidState: BidState | null
}

export interface ServerToClientEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	GameStateUpdate: (payload: GameStateUpdatePayload) => void
	PlayerInitialization: (payload: PlayerInitializationPayload) => void
}
