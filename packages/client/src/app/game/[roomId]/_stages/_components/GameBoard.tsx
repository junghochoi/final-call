import { useState, useEffect } from "react"

import { AuctionState, BidState, CardType, Cash, Player, SessionID, Stage } from "@final-call/shared"

import { PlayerBox } from "./playerBox"
import { uniqueKey } from "@/lib/utils"
import { Card } from "./CommunityCard"
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
	const [propertyCards, setPropertyCards] = useState<number[]>([])

	useEffect(() => {
		setPropertyCards(bidState.roundCards.sort((a, b) => a - b))
	}, [bidState.roundCards])

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
	}, [auctionState.playerSellingPropertyCard, auctionState.roundCards])
	// top-[calc(50%-2rem)] md:top-[calc(50%-3.5rem)]
	return (
		<div className="bg-[#1F002E] h-screen  mx-auto relative overscroll-none shadow-xl p-4">
			<div className="relative h-[calc(100%-7em)]">
				<div className="bg-blue-200 p-1 rounded flex justify-center space-x-4 absolute h-16 md:h-28 w-2/3 shadow-sm shadow-fuchsia-blue-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					{stage === Stage.Bidding && (
						<AnimatePresence>
							{bidState.roundCards.map((num: number, index: number) => (
								<Card
									key={uniqueKey(num, index)}
									value={`${num}`}
									labelVisible={false}
									animateLastCard={bidState.endRoundAnimate}
									cardType={CardType.Property}
								/>
							))}
						</AnimatePresence>
					)}

					{stage === Stage.Auctioning && (
						<>
							{cashCards.map(({ cashCard, propertyCard, sessionId }, index) => {
								return (
									<Card
										key={uniqueKey(cashCard, index)}
										position={index}
										value={`${cashCard}`}
										labelVisible={auctionState.endRoundAnimate}
										label={`${
											playerOrder.find((player) => player.sessionId === sessionId)?.nickname
										} - ${propertyCard}`}
										cardType={CardType.Cash}
									/>
								)
							})}
						</>
					)}
				</div>

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
