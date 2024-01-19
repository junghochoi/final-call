"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

import { getNickname, getSessionId, persistSessionId } from "@/lib/utils"
import { getSocketConnection } from "@/lib/socketUtils"
import UsernameSelection from "./usernameSelection"
import { Lobby, Game } from "./_stages"

import { useSocket } from "@/contexts/SocketContext"

import {
	Player,
	ServerToClientEvents,
	ClientToServerEvents,
	PlayerInitializationPayload,
	GameStateUpdatePayload,
	Stage,
	Action,
	ClientBidState,
	GameState,
} from "@/types"

// let socket: Socket<ServerToClientEvents, ClientToServerEvents>

// async function initializeSocket(roomId: string) {
// 	socket = await getSocketConnection(roomId)
// }

const GamePage = () => {
	const { socket } = useSocket()
	const { roomId } = useParams<{ roomId: string }>()

	const [connected, setConnected] = useState<boolean>(false)
	const [gameState, setGameState] = useState<GameState>({
		stage: Stage.Lobby,
		currPlayer: undefined,
		players: [],
		bidState: undefined,
	})

	useEffect(() => {
		startGameEventHandlers()
		socket.connect()

		return () => {
			socket.disconnect()
		}
	}, [])

	const handleUserJoinGame = async (nickname: string) => {
		const sessionId = getSessionId()

		if (sessionId === undefined) {
			throw new Error("sessionID not defined")
		} else if (socket === undefined) {
			throw new Error("socket not defined")
		} else if (!socket.connected) {
			throw new Error("socket is not connected")
		} else {
			const player: Player = {
				nickname,
				roomId,
				sessionId,
				host: false,
				socketId: socket.id!,
			}
			socket.emit("PlayerJoin", player)
		}
	}
	const handleStartGame = () => {
		if (socket) {
			socket.emit("StageChange", { roomId: roomId, stage: Stage.Bidding })
		}
	}

	// const handleAction = (action: Action) => {
	// 	console.log(action)
	// }

	const startGameEventHandlers = () => {
		if (!socket) return
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

		socket.on("GameStateUpdate", (gameStateUpdate: GameStateUpdatePayload) => {
			const currPlayer = gameStateUpdate.players.find((player) => player.sessionId === getSessionId())
			const gameState: GameState = {
				...gameStateUpdate,
				currPlayer: currPlayer,
			}
			setGameState(gameState)
		})
	}

	if (!connected || !socket) {
		return <div>Connecting...</div>
	}
	if (gameState.currPlayer === undefined) {
		return <UsernameSelection handleUserJoinGame={handleUserJoinGame} />
	} else if (gameState.stage == Stage.Lobby) {
		return <Lobby gameState={gameState} handleStartGame={handleStartGame} />
	} else if (gameState.stage == Stage.Bidding || gameState.stage == Stage.Auctioning) {
		return <Game roomId={roomId} gameState={gameState} />
	} else {
		return <div>Hello</div>
	}
}

export default GamePage
