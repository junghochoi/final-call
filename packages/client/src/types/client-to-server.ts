import { Player } from "./common"

export interface ClientToServerEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	PlayerReconnect: (payload: Player) => void
}
