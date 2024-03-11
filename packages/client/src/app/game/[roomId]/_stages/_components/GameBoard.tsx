"use client"

import { useState, useEffect } from "react"

import { AuctionState, BidState, CardType, Player, SessionID, Stage, Card } from "@final-call/shared"

import { PlayerBox } from "./playerBox"
import { uniqueKey } from "@/lib/utils"
import { CommunityCard } from "./CommunityCard"
import { AnimatePresence } from "framer-motion"

interface GameBoardProps {
	stage: Stage
	bidState: BidState
	playerOrder: Player[]
	auctionState: AuctionState
	currPlayer: Player
	currPlayerBank: number
}

export type CashCard = {
	sessionId?: SessionID
	propertyCard?: Card
	cashCard: Card
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
	const [propertyCards, setPropertyCards] = useState<Card[]>([])

	useEffect(() => {
		const orderedCards = Array.from(bidState.roundCards).sort((a, b) => a.value - b.value)
		setPropertyCards(orderedCards)
	}, [bidState.roundCards])

	useEffect(() => {
		const orderedSellingProperties = Array.from(auctionState.playerSellingPropertyCard.entries()).sort(
			(a, b) => a[1].value - b[1].value
		)
		const orderedCashCards = Array.from(auctionState.roundCards)
			.sort((a, b) => a.value - b.value)
			.map((cashCard, ind) => {
				if (ind >= orderedSellingProperties.length) {
					return {
						cashCard: cashCard,
					}
				} else {
					return {
						sessionId: orderedSellingProperties[ind][0],
						propertyCard: orderedSellingProperties[ind][1],
						cashCard: cashCard,
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
							{propertyCards.map((card: Card, index: number) => (
								<CommunityCard
									card={card}
									key={card.id}
									labelVisible={false}
									animateLastCard={bidState.endRoundAnimate}
								/>
							))}
						</AnimatePresence>
					)}

					{stage === Stage.Auctioning && (
						<>
							{cashCards.map(({ cashCard, propertyCard, sessionId }, index) => {
								return (
									<CommunityCard
										key={cashCard.id}
										position={index}
										labelVisible={auctionState.endRoundAnimate}
										label={`${playerOrder.find((player) => player.sessionId === sessionId)?.nickname} - ${
											propertyCard?.value
										}`}
										card={cashCard}
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
