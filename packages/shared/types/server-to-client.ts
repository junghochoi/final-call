import { Player, Stage, PlayerInitializationPayload, SessionID } from "./common"

export type GameStateUpdatePayload = {
	roomId: string
	players: Player[]
	stage: Stage
	// bidState: {
	// 	round: number
	// 	players: Player[]
	// 	currentBids: Map<SessionID, number>
	// 	turn: number
	// }
}

export interface ServerToClientEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	GameStateUpdate: (payload: GameStateUpdatePayload) => void
	PlayerInitialization: (payload: PlayerInitializationPayload) => void
}
