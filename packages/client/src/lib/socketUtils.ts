import io, { Socket } from "socket.io-client"

import { USE_LOCAL_WS } from "@/config"
import { getConnectionInfo } from "@/api/room"
import { RoomID } from "@final-call/shared"

export async function getSocketConnection(roomId: RoomID) {
	const connectionInfo = getConnectionInfo()

	let websocketUrl = ""

	if (USE_LOCAL_WS) {
		websocketUrl = "http://localhost:8000"
	} else {
		websocketUrl = "https://final-call-3-0.onrender.com"
	}

	// const websocketUrl = `${USE_LOCAL_WS ? "http://" : "https://"}${connectionInfo.host}:${connectionInfo.port}`

	const socket = io(websocketUrl, {
		transports: ["websocket"],
		upgrade: false,
		autoConnect: true,
	})

	return socket
}
