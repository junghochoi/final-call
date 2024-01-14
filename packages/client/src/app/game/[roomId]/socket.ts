import io, { Socket } from "socket.io-client"

import { USE_LOCAL_WS } from "@/config"
import { getConnectionInfo } from "@/api/room"
import { getNickname, getSessionId, persistSessionId } from "@/lib/utils"
import {
	RoomID,
	ServerToClientEvents,
	ClientToServerEvents,
	PlayerInitializationPayload,
	GameStateUpdatePayload,
	Player,
} from "@/types"
import { GameState } from "./page"

export async function getSocketConnection(roomId: RoomID) {
	const connectionInfo = await getConnectionInfo(roomId)

	const websocketUrl = `${USE_LOCAL_WS ? "ws://" : "wss://"}${connectionInfo.exposedPort?.host}:${
		connectionInfo.exposedPort?.port
	}`

	console.log(websocketUrl)

	const socket = io(websocketUrl, {
		transports: ["websocket"],
		upgrade: false,
		autoConnect: false,
		auth: {
			roomId: roomId,
			nickname: getNickname(),
			sessionId: getSessionId(),
		},
	})

	return socket
}

// interface SocketLogic {
// 	roomId: RoomID
// 	onPlayerInitialization: (payload: PlayerInitializationPayload) => void
// 	onGameStateUpdate: (payload: GameStateUpdatePayload) => void
// }

// export async function startSocketLogic({ roomId, onPlayerInitialization, onGameStateUpdate }: SocketLogic) {
// 	const socket = await getSocketConnection(roomId)
// 	socket.on("PlayerInitialization", (payload: PlayerInitializationPayload) => {
// 		socket.emit("PlayerJoin", payload.playerData)
// 	})

// 	socket.on("GameStateUpdate", (gameStateUpdate: GameStateUpdatePayload) => {})

// 	return {
// 		cleanup() {
// 			socket.disconnect()
// 		},
// 	}
// }