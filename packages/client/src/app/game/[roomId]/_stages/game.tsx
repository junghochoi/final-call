import { useState, useEffect, useCallback } from "react"

import { Card, GameState, IndividualGameStateUpdatePayload, Stage } from "@final-call/shared"
import { BidAction, PassAction, SellAction, RoomID, Action, Player } from "@final-call/shared"
import { BidActionBar } from "./_components/bidActionBar"
import { useSocket } from "@/contexts/SocketContext"
import { GameBoard as GameBoard } from "./_components/GameBoard"
import { AuctionActionBar } from "./_components/auctionActionBar"
interface GameProps {
	gameState: GameState
	roomId: RoomID
	handleGameAction: (action: Action) => void
}

export const Game = ({ gameState, roomId, handleGameAction }: GameProps) => {
	const { socket } = useSocket()
	const [currPlayerTurnIndex, setCurrPlayerTurnIndex] = useState<number>(0)
	const [currPlayerBank, setCurrPlayerBank] = useState<number>(0)
	const [currPlayerPropertyCards, setCurrPlayerPropertyCards] = useState<Card[]>([])
	const [currPlayerCashCards, setCurrPlayerCashCards] = useState<Card[]>([])
	const [highestBid, setHighestBid] = useState<number>(0)

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
		switch (individualState.stage) {
			case Stage.Bidding:
				setCurrPlayerBank(individualState.bank)
				setCurrPlayerPropertyCards(individualState.propertyCards)
				break
			case Stage.Auctioning:
				console.log(individualState.cashCards)
				setCurrPlayerPropertyCards(individualState.propertyCards)
				setCurrPlayerCashCards(individualState.cashCards)
				setCurrPlayerBank(individualState.bank)
				break
		}
	}, [])

	useEffect(() => {
		socket.on("IndividualGameStateUpdate", (payload: IndividualGameStateUpdatePayload) => {
			console.log(payload)
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

	const handleSellPropertyAction = (property: Card) => {
		if (gameState.auctionState?.playerSellingPropertyCard.has(gameState.currPlayer?.sessionId!)) {
			return
		}
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
	if (gameState.auctionState === undefined) {
		return <p>Game State Loading - auctionstate not defined</p>
	} else if (gameState.currPlayer === undefined) {
		return <p>Error: CurrPlayerNot Defined</p>
	}
	return (
		<div>
			<div className="relative mx-auto">
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
						yourTurn={currPlayerTurnIndex === gameState.bidState.playerTurn && !gameState.bidState.endRoundAnimate}
					/>
				)}

				{gameState.stage === Stage.Auctioning && (
					<AuctionActionBar
						currPlayerPropertyCards={currPlayerPropertyCards}
						currPlayerCashCards={currPlayerCashCards}
						sell={handleSellPropertyAction}
						canTakeAction={!gameState.auctionState.endRoundAnimate}
					/>
				)}
			</div>
		</div>
	)
}
