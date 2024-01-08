import io from "socket.io-client"
import { USE_LOCAL_WS } from "@/config"

import { getConnectionInfo } from "@/api/room"
import { getNickname, getSessionId } from "@/lib/utils"
import { RoomID } from "@/types"

export async function getSocketConnection(roomId: RoomID) {
	const connectionInfo = await getConnectionInfo(roomId)

	const websocketUrl = `${USE_LOCAL_WS ? "ws://" : "wss://"}${
		connectionInfo.exposedPort?.host
	}:${connectionInfo.exposedPort?.port}`

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
