import { useState, useEffect, useCallback } from "react"

import { GameState, IndividualGameStateUpdatePayload, Stage } from "@final-call/shared"
import { BidAction, PassAction, SellAction, RoomID, Action, Player } from "@final-call/shared"
import { PlayerBox } from "./_components/playerBox"
import { BidActionBar } from "./_components/bidActionBar"
import { Card } from "./_components/card"
import { cn, zip } from "@/lib/utils"
import { useSocket } from "@/contexts/SocketContext"
import { GameBoard as GameBoard } from "./_components/GameBoard"
import { AuctionActionBar } from "./_components/auctionActionBar"
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

	const [currPlayerCashCards, setCurrPlayerCashCards] = useState<number[]>([])

	useEffect(() => {
		const ind = gameState.playerOrder.findIndex((player) => player.sessionId === gameState.currPlayer?.sessionId)
		if (ind === undefined) {
			throw new Error("currplayer not found in bidstate")
		}
		setCurrPlayerTurnIndex(ind || 0)

		const highest = Math.max(...Array.from(gameState.bidState!.playerBids.values()))
		setHighestBid(highest)
	}, [gameState.bidState])

	const individualGameStateCallback = useCallback((individualState: IndividualGameStateUpdatePayload) => {
		console.log("individualGameStateCallback used")
		switch (individualState.stage) {
			case Stage.Bidding:
				setCurrPlayerBank(individualState.bank)
				setCurrPlayerPropertyCards(individualState.propertyCards)
				break
			case Stage.Auctioning:
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
	}

	const handleSellPropertyAction = (property: number) => {
		const action: SellAction = {
			name: "sell",
			roomId: roomId,
			player: gameState.currPlayer!,
			property: property,
		}

		socket.emit("GameAction", {
			roomId,
			action,
		})
	}

	if (gameState.bidState === undefined) {
		return <p>Game State Loading - bidstate not defined</p>
	}
	if (gameState.auctionState === undefined && gameState.stage === Stage.Auctioning) {
		return <p>Game State Loading - auctionstate not defined</p>
	} else if (gameState.currPlayer === undefined) {
		return <p>Error: CurrPlayerNot Defined</p>
	}
	return (
		<>
			<GameBoard
				stage={gameState.stage}
				currPlayerBank={currPlayerBank}
				playerOrder={gameState.playerOrder}
				bidState={gameState.bidState!}
				auctionState={gameState.auctionState!}
				currPlayer={gameState.currPlayer}
			/>

			{gameState.stage === Stage.Bidding && (
				<BidActionBar
					bid={handleBidAction}
					pass={handlePassAction}
					currPlayerBank={currPlayerBank}
					currPlayerPropertyCards={currPlayerPropertyCards}
					currPlayerBid={gameState.bidState!.playerBids.get(gameState.currPlayer!.sessionId) ?? 0}
					highestBid={highestBid}
					communityCards={gameState.bidState!.roundCards}
					stage={gameState.stage}
					yourTurn={currPlayerTurnIndex === gameState.bidState!.playerTurn}
				/>
			)}

			{gameState.stage === Stage.Auctioning && (
				<AuctionActionBar
					currPlayerPropertyCards={currPlayerPropertyCards}
					currPlayerCashCards={currPlayerCashCards}
					sell={handleSellPropertyAction}
				/>
			)}
		</>
	)
}
