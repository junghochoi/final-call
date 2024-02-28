import { useState, useEffect } from "react"

import { AuctionState, BidState, Cash, Player, SessionID, Stage } from "@final-call/shared"

import { PlayerBox } from "./playerBox"
import { zip } from "@/lib/utils"
import { Card } from "./card"
import { AnimatePresence } from "framer-motion"

interface GameBoardProps {
	stage: Stage
	bidState: BidState
	playerOrder: Player[]
	auctionState: AuctionState
	currPlayer: Player
	currPlayerBank: number
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

export type CashCard = {
	sessionId?: SessionID
	propertyCard?: number
	cashCard: number
}

export const GameBoard = ({
	stage,
	currPlayer,
	bidState,
	auctionState,
	currPlayerBank,
	playerOrder,
}: GameBoardProps) => {
	// const playerOrder = bidState.playerOrder ?? auctionState.playerOrder

	const [cashCards, setCashCards] = useState<CashCard[]>([])

	useEffect(() => {
		const orderedSellingProperties = Array.from(auctionState.playerSellingPropertyCard.entries()).sort(
			(a, b) => a[1] - b[1]
		)

		const orderedCashCards = Array.from(auctionState.roundCards)
			.sort((a, b) => a - b)
			.map((cashCard, ind) => {
				if (ind >= orderedSellingProperties.length) {
					return {
						cashCard,
					}
				} else {
					return {
						sessionId: orderedSellingProperties[ind][0],
						propertyCard: orderedSellingProperties[ind][1],
						cashCard,
					}
				}
			})

		setCashCards(orderedCashCards)

		// setPlayerSellingPropertiesOrdered(orderedSellingProperties)
	}, [auctionState.playerSellingPropertyCard, auctionState.roundCards])

	return (
		<div className=" bg-fuchsia-blue-950 h-screen  mx-auto relative overscroll-none shadow-xl p-4">
			<div className="relative h-[calc(100%-7em)]">
				<div className="flex justify-center space-x-4 absolute h-16 md:h-28 w-2/3 mx-auto bg-slate-400 top-[calc(50%-2rem)] md:top-[calc(50%-3.5rem)]">
					{stage === Stage.Bidding && (
						<AnimatePresence>
							{bidState.roundCards.map((num: number) => (
								<Card key={num} value={`${num}`} labelVisible={false} />
							))}
						</AnimatePresence>
					)}

					{stage === Stage.Auctioning && (
						<>
							{cashCards.map(({ cashCard, propertyCard, sessionId }) => {
								console.log(auctionState.endRoundAnimate)
								return (
									<Card
										key={cashCard}
										value={`$${cashCard}`}
										labelVisible={auctionState.endRoundAnimate}
										label={`${sessionId} - ${propertyCard}`}
									/>
								)
							})}
						</>
					)}
				</div>
				{/* {stage === Stage.Bidding && (
					<div className="flex justify-center space-x-4 absolute h-16 md:h-28 w-2/3 mx-auto bg-slate-400 top-[calc(50%-2rem)] md:top-[calc(50%-3.5rem)]"></div>
				)} */}
				{/* {stage === Stage.Auctioning && (
					<div className="flex justify-center space-x-4 absolute h-16 md:h-28 w-2/3 bg-slate-400 top-[calc(50%-2rem)] md:top-[calc(50%-3.5rem)]"></div>
				)} */}

				{playerOrder.map((player, ind) => {
					return (
						<PlayerBox
							playerPosition={ind}
							playerPresent={true}
							playerTurn={bidState!.playerTurn === ind}
							currPlayer={player.sessionId === currPlayer.sessionId}
							stage={stage}
							nickname={player.nickname}
							currPlayerBank={player.sessionId === currPlayer.sessionId ? currPlayerBank : undefined}
							key={player.sessionId}
							bid={bidState!.playerBids.get(player.sessionId) ?? 0}
							propertyCard={{
								value: auctionState.playerSellingPropertyCard.get(player.sessionId),
								visible: auctionState.playerSellingPropertyCard.size === playerOrder.length,
							}}
							animateWinner={bidState.endRoundAnimate && bidState.playerTurn === ind}
						/>
					)
				})}
				{Array.from({ length: 6 - (playerOrder.length || 0) }).map((_, ind) => (
					<PlayerBox
						stage={stage}
						playerPresent={false}
						playerTurn={false}
						playerPosition={playerOrder.length + ind}
						currPlayer={false}
						key={ind}
						animateWinner={false}
					/>
				))}
			</div>
		</div>
	)
}
