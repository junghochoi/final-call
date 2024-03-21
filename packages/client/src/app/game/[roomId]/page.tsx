"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

// import { betSoundEffect, passSoundEffect } from "@/lib/soundEffects"

import { useAudio } from "@/hooks/useAudio"

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
import { cn, getNickname, getSessionId, persistSessionId } from "@/lib/utils"
import { useSocket } from "@/contexts/SocketContext"
import UsernameSelection from "./usernameSelection"
import { Lobby, Game, Results } from "./_stages"
import {
	BET_SOUND_EFFECT_PATH,
	PASS_SOUND_EFFECT_PATH,
	END_AUCTION_SOUND_EFFECT_PATH,
	PLACING_CARD_SOUND_EFFECT_PATH,
} from "@/lib/soundEffects"
import { AnimatePresence } from "framer-motion"
import { Loading } from "@/components/shared/Loading"

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

	// const betSoundEffect = useAudio(BET_SOUND_EFFECT_PATH)
	// const passSoundEffect = useAudio(PASS_SOUND_EFFECT_PATH)

	const betSound = useAudio(BET_SOUND_EFFECT_PATH)
	const passSound = useAudio(PASS_SOUND_EFFECT_PATH)
	const placingCardSound = useAudio(PLACING_CARD_SOUND_EFFECT_PATH)
	const auctionEndSound = useAudio(END_AUCTION_SOUND_EFFECT_PATH)

	const playerInitializationCallback = useCallback((playerData: Player) => {
		setConnected(true)
		setGameState((prevGameState) => ({
			...prevGameState,
			currPlayer: playerData,
		}))
		socket.emit("PlayerJoin", playerData)

		persistSessionId(playerData.sessionId)

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
					betSound.play()
					break
				}

				case Sound.Pass: {
					passSound.play()
					break
				}
				case Sound.PlacingCard: {
					placingCardSound.play()
					break
				}
				case Sound.EndAuction: {
					auctionEndSound.play()
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

	let component = null

	if (!pickedName) {
		component = <UsernameSelection handleUserJoinGame={handleUserJoinGame} />
	} else if (gameState.stage == Stage.Lobby) {
		component = <Lobby gameState={gameState} handleStartGame={handleStartGame} />
	} else if (gameState.stage == Stage.Bidding || gameState.stage == Stage.Auctioning) {
		component = (
			<motion.div
				key={"game"}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0, transition: { duration: 1 } }}
			>
				<Game roomId={roomId} gameState={gameState} handleGameAction={handleGameAction} />
			</motion.div>
		)
	} else if (gameState.stage === Stage.Result) {
		component = (
			<motion.div
				key={"results"}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 1, delay: 1 } }}
			>
				<Results gameState={gameState} />
			</motion.div>
		)
	} else {
		component = <div>{gameState.stage}</div>
	}

	return (
		<AnimatePresence>
			{pickedName && !connected && <Loading />}
			{component}
		</AnimatePresence>
	)
}

export default GamePage
