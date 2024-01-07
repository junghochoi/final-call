import io from "socket.io-client"
import { USE_LOCAL_WS } from "@/config"

import { getConnectionInfo } from "@/api/room"
import { getNickname, getSessionId } from "@/lib/utils"

export async function start({ roomId }: { roomId: string }) {
	const connectionInfo = await getConnectionInfo(roomId)

	const websocketUrl = `${USE_LOCAL_WS ? "ws://" : "wss://"}${
		connectionInfo.exposedPort?.host
	}:${
		connectionInfo.exposedPort?.port
	}?roomId=${roomId}&nickname=${getNickname()}&sessionId=${getSessionId()}`

	console.log(websocketUrl)

	const socket = io(websocketUrl, {
		transports: ["websocket"],
		upgrade: false,
	})

	socket.on("PlayerInitialization", (socket) => {
		console.log("Hello world")
	})
}
