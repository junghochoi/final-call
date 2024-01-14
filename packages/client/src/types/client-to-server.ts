import { Player, Stage } from "./common"

export interface ClientToServerEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	PlayerReconnect: (payload: Player) => void
	StageChange: (payload: { stage: Stage }) => void
}
