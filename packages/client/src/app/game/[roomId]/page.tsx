"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

import { getNickname, getSessionId, persistSessionId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

	const [connected, setConnected] = useState<boolean>(false)
	const [gameState, setGameState] = useState<GameState>({
		currPlayer: undefined,
		players: [],
	})

	useEffect(() => {
		let cancel = false
		initializeSocket(roomId).then(() => {
			if (cancel) {
				socket.disconnect()
				return
			}
			startGameEventHandlers()
			socket.connect()
		})

		return () => {
			cancel = true
		}
	}, [])

	const handleUserJoinGame = async (nickname: string) => {
		const sessionId = getSessionId()

		if (sessionId === undefined) {
			throw new Error("sessionID not defined")
		} else {
			const player: Player = {
				nickname,
				roomId,
				sessionId,
				host: false,
			}
			socket.emit("PlayerJoin", player)
		}
	}

	const startGameEventHandlers = () => {
		socket.on("PlayerInitialization", ({ sessionId, playerData }: PlayerInitializationPayload) => {
			if (playerData) {
				setGameState((prevGameState) => ({
					...prevGameState,
					currPlayer: playerData,
				}))
				socket.emit("PlayerJoin", playerData)
			}
			persistSessionId(sessionId)
			setConnected(true)
		})

		socket.on("GameStateUpdate", ({ roomId, players }: GameStateUpdatePayload) => {
			const currPlayer = players.find((player) => player.sessionId === getSessionId())

			setGameState((prev) => ({
				currPlayer,
				players,
			}))
		})
	}

	if (!connected) {
		return <div>Connecting...</div>
	}

	if (gameState.currPlayer === undefined) {
		return <UsernameSelection handleUserJoinGame={handleUserJoinGame} />
	} else {
		return (
			<div className="flex justify-center items-center flex-col lg:max-w-screen-lg mx-auto h-screen bg-blue-400">
				<p>Game Page</p>

				<div className="flex w-2/3">
					<ul className="w-1/2 space-y-2">
						{gameState.players.map((player) => (
							<PlayerCard
								currPlayer={player.sessionId == gameState.currPlayer?.sessionId}
								player={player}
								key={player.sessionId}
							/>
						))}
					</ul>

					<div className="bg-green-200 w-1/2 min-h-80 relative">
						<h1>Settings</h1>
						<div>
							{gameState.currPlayer.host && <Button className="absolute bottom-3 w-full">Play</Button>}

							{!gameState.currPlayer.host && <Button className="absolute bottom-3 w-full">Waiting for host...</Button>}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default GamePage
