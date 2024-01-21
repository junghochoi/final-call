"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
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
	PlayerInit,
} from "@/types"

// let socket: Socket<ServerToClientEvents, ClientToServerEvents>

// async function initializeSocket(roomId: string) {
// 	socket = await getSocketConnection(roomId)
// }

function useNickname() {
	const [nickname, setNickname] = useState<string | undefined>()
	useEffect(() => {
		setNickname(getNickname())
	}, [])
	return nickname
}

const GamePage = () => {
	const { socket } = useSocket()
	const { roomId } = useParams<{ roomId: string }>()
	const nickname = useNickname()

	const [connected, setConnected] = useState<boolean>(false)
	const [gameState, setGameState] = useState<GameState>({
		stage: Stage.Lobby,
		currPlayer: undefined,
		players: [],
		bidState: undefined,
	})

	const playerInitializationCallback = useCallback((playerData: Player) => {
		console.log(playerData)
		setGameState((prevGameState) => ({
			...prevGameState,
			currPlayer: playerData,
		}))
		socket.emit("PlayerJoin", playerData)

		persistSessionId(playerData.sessionId)
		setConnected(true)
	}, [])

	useEffect(() => {
		socket.on("connect", () => {
			startGameEventHandlers()

			console.log(nickname)
			if (nickname !== undefined) {
				const playerInit: PlayerInit = {
					nickname,
					roomId,
					sessionId: getSessionId(),
					host: true,
					socketId: socket.id!,
				}
				socket.emit("PlayerInitialization", playerInit, playerInitializationCallback)
			}
		})
	}, [nickname])

	const handleUserJoinGame = async (nickname: string) => {
		const sessionId = getSessionId()

		const player: PlayerInit = {
			nickname,
			roomId,
			sessionId,
			host: false,
			socketId: socket.id!,
		}
		socket.emit("PlayerInitialization", player, playerInitializationCallback)
	}
	const handleStartGame = () => {
		if (socket) {
			socket.emit("StageChange", { roomId: roomId, stage: Stage.Bidding })
		}
	}
	const startGameEventHandlers = () => {
		socket.on("GameStateUpdate", (gameStateUpdate: GameStateUpdatePayload) => {
			const currPlayer = gameStateUpdate.players.find((player) => player.sessionId === getSessionId())
			const gameState: GameState = {
				...gameStateUpdate,
				currPlayer: currPlayer,
			}
			setGameState(gameState)
		})
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
