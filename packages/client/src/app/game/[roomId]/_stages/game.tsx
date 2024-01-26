import { useState, useEffect, useCallback } from "react"

import { GameState, IndividualGameStateUpdatePayload, Stage } from "@final-call/shared"
import { BidAction, PassAction, RoomID, Action, Player } from "@final-call/shared"
import { PlayerBox } from "./_components/playerBox"
import { ActionBar } from "./_components/actionBar"
import { Card } from "./_components/card"
import { cn, zip } from "@/lib/utils"
import { useSocket } from "@/contexts/SocketContext"
import { BiddingComponent } from "./_components/biddingComponent"
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

	const individualGameStateCallback = useCallback((individualState: IndividualGameStateUpdatePayload) => {
		switch (individualState.stage) {
			case Stage.Bidding:
				setCurrPlayerBank(individualState.bank)
				setCurrPlayerPropertyCards(individualState.propertyCards)
				break
			case Stage.Auctioning:
				console.log("individual Game state Update")
				break
		}
	}, [])

	useEffect(() => {
		socket.on("IndividualGameStateUpdate", (payload: IndividualGameStateUpdatePayload) => {
			individualGameStateCallback(payload)
		})
		socket.emit("IndividualGameStateInitialization", gameState.currPlayer!, individualGameStateCallback)
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
		// socket.emit("IndividualGameState", gameState.currPlayer!, individualGameStateCallback)
	}
	// {gameState.stage === Stage.Bidding && (
	//
	if (gameState.bidState === undefined) {
		return <p>Game State Loading</p>
	} else if (gameState.currPlayer === undefined) {
		return <p>Error: CurrPlayerNot Defined</p>
	}
	return (
		<>
			<BiddingComponent
				stage={gameState.stage}
				currPlayerBank={currPlayerBank}
				bidState={gameState.bidState}
				currPlayer={gameState.currPlayer}
			/>

			{/* {gameState.stage === Stage.Auctioning && <div>This is auctioning</div>} */}

			<ActionBar
				bid={handleBidAction}
				pass={handlePassAction}
				currPlayerBank={currPlayerBank}
				currPlayerPropertyCards={currPlayerPropertyCards}
				currPlayerBid={gameState.bidState.playerBids.get(gameState.currPlayer!.sessionId) ?? 0}
				highestBid={highestBid}
				communityCards={gameState.bidState.roundCards}
				yourTurn={currPlayerTurnIndex === gameState.bidState.playerTurn}
			/>
		</>
	)
}
