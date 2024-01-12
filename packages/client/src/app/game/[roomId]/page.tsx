"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

import { getNickname, getSessionId, persistSessionId } from "@/lib/utils"
import { getSocketConnection } from "./socket"
import { PlayerCard } from "./playerCard"
import UsernameSelection from "./usernameSelection"

import {
	Player,
	ServerToClientEvents,
	ClientToServerEvents,
	PlayerInitializationPayload,
	GameStateUpdatePayload,
} from "@/types"

export type GameState = {
	currPlayer: Player | undefined
	players: Player[]
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>
async function initializeSocket(roomId: string) {
	socket = await getSocketConnection(roomId)
}

const GamePage = () => {
	const { roomId } = useParams<{ roomId: string }>()

	const [gameState, setGameState] = useState<GameState>({
		currPlayer: undefined,
		players: [],
	})

	useEffect(() => {
		initializeSocket(roomId).then(() => {
			startGameEventHandlers()
			socket.connect()

			return () => {
				socket.disconnect()
				socket.off("connect")
			}
		})
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
	} else {
		return (
			<div className="lg:max-w-screen-lg mx-auto ">
				<p>Game Page</p>

				<div className="flex">
					<ul>
						{gameState.players.map((player) => (
							<PlayerCard
								currPlayer={player.sessionId == gameState.currPlayer?.sessionId}
								nickname={player.nickname}
								key={player.sessionId}
							/>
						))}
					</ul>
				</div>
			</div>
		)
	}
}

export default GamePage
