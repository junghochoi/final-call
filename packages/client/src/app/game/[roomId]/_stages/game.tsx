import { useState, useEffect, useCallback } from "react"

import { GameState, IndividualGameState } from "@final-call/shared"
import { BidAction, PassAction, RoomID, Action, Player } from "@final-call/shared"
import { PlayerBox } from "./_components/playerBox"
import { ActionBar } from "./_components/actionBar"
import { Card } from "./_components/card"
import { cn, zip } from "@/lib/utils"
import { useSocket } from "@/contexts/SocketContext"
interface GameProps {
	gameState: GameState
	roomId: RoomID
	handleGameAction: (action: Action) => void
}

const playerBoxPositions = [
	"left-[calc(50%-2.5rem)] md:left-[calc(50%-3.5rem)] bottom-[0.5rem]",
	"left-[0.5rem] bottom-[20%]",
	"left-[0.5rem] top-[20%]",
	"left-[calc(50%-2.5rem)] md:left-[calc(50%-3.5rem)] top-[0.5rem]",
	"right-[0.5rem] top-[20%]",
	"right-[0.5rem] bottom-[20%]",
]

const playerBidPositions = [
	"left-[calc(50%-0.75rem)] bottom-[4.5rem]",
	"left-[6.5rem] md:left-[8rem] bottom-[calc(20%+1rem)]",
	"left-[6.5rem] md:left-[8rem] top-[calc(20%+1rem)]",
	"left-[calc(50%-0.75rem)] top-[4.5rem]",
	"right-[6.5rem] md:right-[8rem] top-[calc(20%+1rem)]",
	"right-[6.5rem] md:right-[8rem] bottom-[calc(20%+1rem)]",
]

const BOX_POSITION = 0
const BID_POSITION = 1

const playerPositions = zip(playerBoxPositions, playerBidPositions)

const playerPresentStyle = "bg-blue-300"
const playerAbsentStyle = "bg-gray-300"
const currPlayerStyle = "text-white"
const playerTurnStyle = "border-fc-accent border-2"

export const Game = ({ gameState, roomId, handleGameAction }: GameProps) => {
	const { socket } = useSocket()
	const [currPlayerTurnIndex, setCurrPlayerTurnIndex] = useState<number>(0)
	const [currPlayerBank, setCurrPlayerBank] = useState<number>(0)
	const [currPlayerPropertyCards, setCurrPlayerPropertyCards] = useState<number[]>([])
	const [highestBid, setHighestBid] = useState<number>(0)

	useEffect(() => {
		const ind = gameState.bidState?.playerOrder.findIndex(
			(player) => player.sessionId === gameState.currPlayer?.sessionId
		)
		if (ind === undefined) {
			throw new Error("currplayer not found in bidstate")
		}
		setCurrPlayerTurnIndex(ind || 0)

		const highest = Math.max(...Array.from(gameState.bidState!.playerBids.values()))
		setHighestBid(highest)
	}, [gameState.bidState])

	const individualGameStateCallback = useCallback((individualState: IndividualGameState) => {
		console.log("invidiaul state game used")
		switch (individualState.name) {
			case "bid":
				setCurrPlayerBank(individualState.bank)
				setCurrPlayerPropertyCards(individualState.propertyCards)
			case "auction":
				console.log("IndividualGameStateCallback")
		}
	}, [])

	useEffect(() => {
		socket.emit("IndividualGameState", gameState.currPlayer!, individualGameStateCallback)
	}, [])

	const handleBidAction = (amount: number) => {
		const action: BidAction = {
			name: "bid",
			roomId: roomId,
			player: gameState.currPlayer!,
			amount,
		}
		socket.emit("GameAction", {
			roomId,
			action,
		})

		setCurrPlayerBank((prev) => prev - amount)
		handleGameAction(action)
	}

	const handlePassAction = () => {
		const action: PassAction = {
			name: "pass",
			roomId: roomId,
			player: gameState.currPlayer!,
		}
		socket.emit("GameAction", {
			roomId,
			action,
		})
	}

	if (gameState.bidState === undefined) {
		return <p>Game State Loading</p>
	} else {
		return (
			<div className=" bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
				<div className="relative h-[calc(100%-7em)]">
					{/* Community Cards */}
					<div className="flex justify-center space-x-4 absolute h-16 md:h-28 : w-full bg-slate-400 top-[calc(50%-2rem)] md:top-[calc(50%-3.5rem)]">
						{gameState.bidState.roundCards.map((num: number) => (
							<Card key={num} value={num} />
						))}
					</div>

					{gameState.bidState.playerOrder.map((player, ind) => {
						return (
							<PlayerBox
								positionTailwindStyle={playerPositions[ind][BOX_POSITION]}
								bidPositionTailwindStyle={playerPositions[ind][BID_POSITION]}
								playerPresenceTailwindStyle={playerPresentStyle}
								playerTurnTailwindStyle={gameState.bidState!.playerTurn === ind ? playerTurnStyle : undefined}
								currPlayerTailwindStyle={
									player.sessionId === gameState.currPlayer?.sessionId ? currPlayerStyle : undefined
								}
								nickname={player.nickname}
								currPlayerBank={player.sessionId === gameState.currPlayer?.sessionId ? currPlayerBank : undefined}
								key={player.sessionId}
								bid={gameState.bidState!.playerBids.get(player.sessionId) ?? 0}
							/>
						)
					})}
					{Array.from({ length: 6 - (gameState.bidState.playerOrder.length || 0) }).map((_, ind) => (
						<PlayerBox
							positionTailwindStyle={playerPositions[ind + gameState.bidState!.playerOrder.length][BOX_POSITION]}
							playerPresenceTailwindStyle={playerAbsentStyle}
							key={ind}
						/>
					))}
				</div>
				<ActionBar
					bid={handleBidAction}
					pass={handlePassAction}
					currPlayerBank={currPlayerBank}
					highestBid={highestBid}
					yourTurn={currPlayerTurnIndex === gameState.bidState.playerTurn}
				/>
			</div>
		)
	}
}
