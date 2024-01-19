import React, { createContext, useContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { ServerToClientEvents, ClientToServerEvents } from "@/types" // Replace with your actual import
import { getSocketConnection } from "@/lib/socketUtils"

interface SocketContextProps {
	socket?: Socket<ServerToClientEvents, ClientToServerEvents>
	initializeSocket: (roomId: string) => void
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
	const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(undefined)

	const initializeSocket = async (roomId: string) => {
		const s = await getSocketConnection(roomId)

		setSocket(s)
	}

	useEffect(() => {
		// If needed, perform any cleanup when the component unmounts
		return () => {
			socket?.disconnect()
		}
	}, [])

	const contextValue: SocketContextProps = {
		socket,
		initializeSocket,
	}

	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}
