"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

import { getNickname, getSessionId, persistSessionId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getSocketConnection } from "./socketUtils"
import { PlayerCard } from "./playerCard"
import UsernameSelection from "./usernameSelection"
import { Lobby, Game } from "./_stages"

import {
	Player,
	ServerToClientEvents,
	ClientToServerEvents,
	PlayerInitializationPayload,
	GameStateUpdatePayload,
	Stage,
} from "@/types"

export type GameState = {
	stage: Stage
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
		stage: Stage.Lobby,
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
		socket.emit("StageChange", { roomId: roomId, stage: Stage.Bidding })
	}

	const handlePlayerAction = (player: Player, amount: number) => {
		console.log("hello world")
		// socket.emit("GameAction", {
		// 	roomId,
		// })
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

		socket.on("GameStateUpdate", (gameStateUpdate: GameStateUpdatePayload) => {
			const currPlayer = gameStateUpdate.players.find((player) => player.sessionId === getSessionId())
			const gameState: GameState = {
				...gameStateUpdate,
				currPlayer: currPlayer,
			}
			setGameState(gameState)
		})
	}

	if (!connected) {
		return <div>Connecting...</div>
	}
	if (gameState.currPlayer === undefined) {
		return <UsernameSelection handleUserJoinGame={handleUserJoinGame} />
	} else if (gameState.stage == Stage.Lobby) {
		return <Lobby gameState={gameState} handleStartGame={handleStartGame} />
	} else if (gameState.stage == Stage.Bidding || gameState.stage == Stage.Auctioning) {
		return <Game gameState={gameState} />
	} else {
		return <div>Hello</div>
	}
}

export default GamePage
