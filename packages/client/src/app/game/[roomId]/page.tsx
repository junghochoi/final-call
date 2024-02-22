"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"

import { betSoundEffect, passSoundEffect } from "@/lib/soundEffects"

import {
	Player,
	GameStateUpdatePayload,
	Stage,
	GameState,
	PlayerInit,
	BidState,
	Action,
	AuctionState,
	PlayerResultState,
	Sound,
} from "@final-call/shared"
import { getNickname, getSessionId, persistSessionId } from "@/lib/utils"
import { useSocket } from "@/contexts/SocketContext"
import UsernameSelection from "./usernameSelection"
import { Lobby, Game, Results } from "./_stages"

const GamePage = () => {
	const { socket } = useSocket()
	const { roomId } = useParams<{ roomId: string }>()
	const [pickedName, setPickedName] = useState<boolean>(getNickname() !== undefined)
	const [connected, setConnected] = useState<boolean>(false)
	const [gameState, setGameState] = useState<GameState>({
		stage: Stage.Lobby,
		currPlayer: undefined,
		players: [],
		playerOrder: [],
		bidState: undefined,
		auctionState: undefined,
		resultState: undefined,
	})

	const playerInitializationCallback = useCallback((playerData: Player) => {
		setGameState((prevGameState) => ({
			...prevGameState,
			currPlayer: playerData,
		}))
		socket.emit("PlayerJoin", playerData)

		persistSessionId(playerData.sessionId)
		setConnected(true)
		// setTimeout(() => {}, 1000)
	}, [])

	useEffect(() => {
		startGameEventHandlers()
	}, [])

	useEffect(() => {
		socket.on("connect", () => {
			if (!pickedName) return

			const playerInit: PlayerInit = {
				nickname: getNickname() as string,
				roomId,
				sessionId: getSessionId(),
				host: true,
				socketId: socket.id!,
			}
			socket.emit("PlayerInitialization", playerInit, playerInitializationCallback)
		})

		return () => {
			socket.off("connect")
		}
	}, [pickedName])

	const startGameEventHandlers = () => {
		socket.on("GameStateUpdate", (gameStateUpdate: GameStateUpdatePayload) => {
			const currPlayer = gameStateUpdate.players.find((player) => player.sessionId === getSessionId())

			const bidState: BidState = {
				...gameStateUpdate.bidState,
				playerBids: new Map(gameStateUpdate.bidState.playerBids),
			}

			const auctionState: AuctionState = {
				...gameStateUpdate.auctionState,
				playerPropertyCards: new Map(gameStateUpdate.auctionState.playerPropertyCards),
				playerCashCards: new Map(gameStateUpdate.auctionState.playerCashCards),
				playerSellingPropertyCard: new Map(gameStateUpdate.auctionState.playerSellingPropertyCard),
			}

			const resultState = new Map(gameStateUpdate.resultState)

			const gameState: GameState = {
				...gameStateUpdate,
				auctionState: auctionState,
				bidState: bidState,
				currPlayer: currPlayer,
				resultState,
			}
			setGameState(gameState)
		})

		socket.on("PlaySound", ({ sound }) => {
			switch (sound) {
				case Sound.Bet: {
					betSoundEffect.play()
					break
				}

				case Sound.Pass: {
					passSoundEffect.play()
					break
				}
			}
		})
	}

	const handleUserJoinGame = (name: string) => {
		setPickedName(true)
		const sessionId = getSessionId()
		const player: PlayerInit = {
			nickname: name,
			roomId,
			sessionId,
			host: false,
			socketId: socket.id!,
		}
		socket.emit("PlayerInitialization", player, playerInitializationCallback)
	}
	const handleStartGame = () => {
		socket.emit("StageChange", { roomId: roomId, stage: Stage.Bidding })
	}

	const handleGameAction = (action: Action) => {}

	if (!pickedName) {
		return <UsernameSelection handleUserJoinGame={handleUserJoinGame} />
	} else if (gameState.stage == Stage.Lobby) {
		return <Lobby gameState={gameState} handleStartGame={handleStartGame} />
	} else if (gameState.stage == Stage.Bidding || gameState.stage == Stage.Auctioning) {
		return <Game roomId={roomId} gameState={gameState} handleGameAction={handleGameAction} />
	} else if (gameState.stage === Stage.Result) {
		return <Results gameState={gameState} />
	} else {
		return <div>{gameState.stage}</div>
	}
}

export default GamePage
