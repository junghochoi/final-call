"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { ServerToClientEvents, ClientToServerEvents } from "@/types" // Replace with your actual import
import { getSocketConnection } from "@/lib/socketUtils"
import { useParams } from "next/navigation"

interface SocketContextProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined)

export const useSocket = () => {
	const context = useContext(SocketContext)
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider")
	}
	return context
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>()
	const [socketLoading, setSocketLoading] = useState<boolean>(true)
	const { roomId } = useParams<{ roomId: string }>()

	const initializeSocket = async () => {
		const s = await getSocketConnection(roomId)
		setSocket(s)
	}

	useEffect(() => {
		console.log(`useEffect - socket:${socket !== undefined}`)

		initializeSocket()

		// let cancel = false

		// initializeSocket().then((s: Socket) => {
		// 	if (cancel) {
		// 		console.log("socket is disconnecting")
		// 		s.disconnect()
		// 	} else {
		// 		setSocket(s)
		// 		setSocketLoading(false)
		// 	}
		// })
		// return () => {
		// 	cancel = true
		// }
	}, [])

	if (!socket) {
		return <div>Connecting...</div>
	}

	const contextValue = {
		socket,
	}

	return (<SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>) as JSX.Element
}
