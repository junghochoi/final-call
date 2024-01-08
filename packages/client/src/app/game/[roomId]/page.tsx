"use client"

import { getNickname, getSessionId, persistSessionId } from "@/lib/utils"
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
	GameStateUpdatePayload,
} from "@/types"
import UsernameSelection from "../usernameSelection"

export type GameState = {
	currPlayer: Player | undefined
	players: Player[]
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>

const GamePage = () => {
	const { roomId } = useParams<{ roomId: string }>()

	const [gameState, setGameState] = useState<GameState>({
		currPlayer: undefined,
		players: [],
	})

	useEffect(() => {
		getSocketConnection(roomId).then((connection) => {
			socket = connection

			startGameEventHandlers()
			socket.connect()
		})

		return () => {
			console.log(socket)
			socket.disconnect()
			socket.off("connect")
		}
	}, [])

	const handleUserJoinGame = async (nickname: string) => {
		const sessionId = getSessionId()

		if (sessionId === undefined) {
			throw new Error("sessionID not defined")
		} else {
			socket.emit("PlayerJoin", {
				nickname,
				roomId,
				sessionId: sessionId,
			})

			setGameState((prev) => {
				return {
					...prev,
					currPlayer: {
						nickname,
						roomId,
						sessionId: sessionId,
					},
				}
			})
		}
	}

	const startGameEventHandlers = () => {
		socket.on(
			"PlayerInitialization",
			({ sessionId, playerData }: PlayerInitializationPayload) => {
				if (playerData) {
					setGameState((prevGameState) => {
						return {
							...prevGameState,
							currPlayer: playerData,
						}
					})
					socket.emit("PlayerJoin", playerData)
				}
				persistSessionId(sessionId)
			}
		)

		socket.on(
			"GameStateUpdate",
			({ roomId, players }: GameStateUpdatePayload) => {
				console.log("game state update received")
				setGameState((prev) => {
					return {
						...prev,
						players,
					}
				})
			}
		)
	}

	if (gameState.currPlayer === undefined) {
		return <UsernameSelection handleUserJoinGame={handleUserJoinGame} />
	}

	return (
		<div>
			<p>Game Page</p>
			<PlayerCard nickname={gameState.currPlayer?.nickname} />

			<ul>
				{gameState.players.map((player) => (
					<li key={player.sessionId}>{player.nickname}</li>
				))}
			</ul>
		</div>
	)
}

export default GamePage
