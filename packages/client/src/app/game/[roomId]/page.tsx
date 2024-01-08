"use client"

import { getNickname, persistSessionId } from "@/lib/utils"
import { getSocketConnection } from "./socket"
import { useEffect, useState } from "react"
import { PlayerCard } from "./playerCard"
import { useParams } from "next/navigation"

import { Socket } from "socket.io-client"

import {
	Player,
	ServerToClientEvents,
	ClientToServerEvents,
	PlayerInitializationPayload,
} from "@/types"

export type GameState = {
	currPlayer: Player | undefined
	players: Player[]
}

export function useNickname() {
	const [gameState, setGameState] = useState<GameState>()

	// useEffect(() => {
	// 	const nickname = getNickname()
	// 	if (nickname) setNickname(nickname)
	// 	else setNickname("")
	// }, [])
	// return nickname
}

const GamePage = () => {
	const { roomId } = useParams<{ roomId: string }>()

	const [gameState, setGameState] = useState<GameState>({
		currPlayer: undefined,
		players: [],
	})

	useEffect(() => {
		getSocketConnection(roomId).then((socket) => {
			startGameEventHandlers(socket)
			socket.connect()
		})
	}, [])

	const startGameEventHandlers = (
		socket: Socket<ServerToClientEvents, ClientToServerEvents>
	) => {
		socket.on(
			"PlayerInitialization",
			({ sessionId, playerData }: PlayerInitializationPayload) => {
				console.log(playerData)
				if (playerData) {
					setGameState((prevGameState) => {
						return {
							...prevGameState,
							currPlayer: playerData,
						}
					})
					socket.emit("PlayerReconnect", playerData)
				}
				persistSessionId(sessionId)
			}
		)
	}

	if (gameState.currPlayer === undefined) {
		return <div>Curr Player Undefined </div>
	}

	return (
		<div>
			<p>Game Page</p>
			<PlayerCard nickname={gameState.currPlayer?.nickname} />
		</div>
	)
}

export default GamePage
