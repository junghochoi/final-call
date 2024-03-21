"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { ServerToClientEvents, ClientToServerEvents } from "@final-call/shared"
import { getSocketConnection } from "@/lib/socketUtils"
import { useParams } from "next/navigation"
import { Loading } from "@/components/shared/Loading"

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
	const { roomId } = useParams<{ roomId: string }>()

	const initializeSocket = async () => {
		const s = await getSocketConnection(roomId)
		setSocket(s)
	}

	useEffect(() => {
		initializeSocket()
	}, [])

	if (!socket) {
		return <Loading />
	}

	const contextValue = {
		socket,
	}

	return (<SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>) as JSX.Element
}
