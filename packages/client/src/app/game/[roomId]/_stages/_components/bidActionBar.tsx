"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"
import { cn, uniqueKey } from "@/lib/utils"
import { Card, CardType, Stage } from "@final-call/shared"
import { PersonalCard } from "./PersonalCard"

interface ActionBarProps {
	yourTurn: boolean
	currPlayerBank: number
	currPlayerPropertyCards: Card[]
	currPlayerBid: number
	highestBid: number
	communityCards: Card[]
	stage: Stage

	bid: (amount: number) => void
	pass: () => void
}

export const BidActionBar = ({
	bid,
	pass,
	yourTurn,
	currPlayerBank,
	highestBid,
	currPlayerPropertyCards,
	currPlayerBid,
	communityCards,
	stage,
}: ActionBarProps) => {
	const [bidAmount, setBidAmount] = useState<number>(Math.min(highestBid + 1, currPlayerBank + currPlayerBid))
	const [bidMenuOpen, setBidMenuOpen] = useState<boolean>(false)

	useEffect(() => {
		setBidAmount(Math.min(highestBid + 1, currPlayerBank + currPlayerBid))
	}, [highestBid, currPlayerBank])

	const bidClick = () => {
		setBidMenuOpen(false)
		bid(bidAmount)
	}

	const passClick = () => {
		setBidMenuOpen(false)
		pass()
	}

	const handleBidIncrease = () => {
		setBidAmount((prev) => Math.min(currPlayerBank + currPlayerBid, prev + 1))
	}
	const handleBidDecrease = () => {
		setBidAmount((prev) => Math.max(0, prev - 1))
	}
	const handleSliderValueChange = (values: number[]) => {
		setBidAmount(values[0])
	}

	const handleMenu = () => {
		setBidMenuOpen((prev) => !prev)
	}

	const betActionEnabledStyles = yourTurn ? "border-2 border-green-500 hover:bg-green-500" : "border-gray-500 border-2"
	const passActionEnabledStyles = yourTurn ? "border-2 border-red-500 hover:bg-red-500" : "border-gray-500 border-2"
	const cancelActionEnabledStyles = yourTurn ? "border-2 border-gray-300 hover:bg-gray-700" : "border-gray-500 border-2"

	const validBidStyle =
		highestBid < bidAmount && bidAmount <= currPlayerBank + currPlayerBid ? "bg-green-500" : "bg-red-500"

	return (
		<div className="h-28 mx-auto w-full border-t border-fuchsia-blue-900 absolute bottom-0 flex justify-between">
			{!bidMenuOpen && (
				<>
					<div className="w-7/12 px-5 lg:px-10 space-x-2 flex justify-start items-center">
						{currPlayerPropertyCards
							.sort((a, b) => a.value - b.value)
							.map((card, index) => (
								<PersonalCard card={card} key={card.id} />
								// <div key={card} onClick={() => handleSellProperty(card)} className="p-4 border-2 border-black">
								// 	{card}
								// </div>
							))}
					</div>
					<div className="w-5/12 flex justify-around items-center">
						<Button
							disabled={!yourTurn}
							onClick={passClick}
							className={cn("m-0 p-0 h-2/3 lg:h-3/4 w-5/12", passActionEnabledStyles)}
						>
							Pass
						</Button>
						<Button
							disabled={!yourTurn || currPlayerBid + currPlayerBank <= highestBid || communityCards.length === 1}
							onClick={handleMenu}
							className={cn("m-0 p-0 h-2/3 lg:h-3/4 w-5/12", betActionEnabledStyles)}
						>
							Bid
						</Button>
					</div>
				</>
			)}

			{bidMenuOpen && stage === Stage.Bidding && (
				<>
					<div className="w-7/12  p-4 flex justify-around">
						<div className={cn("w-20 flex justify-center items-center rounded text-black", validBidStyle)}>
							<p className="text-2xl text-center p-2">${bidAmount}</p>
						</div>
						<div className="space-y-1 space-y-reverse flex flex-col-reverse items-center justify-aroun md:flex-row w-2/5 md:w-3/5 md:space-y-0">
							<Button
								disabled={!yourTurn}
								onClick={handleBidDecrease}
								className="m-0 p-0 h-10 w-10 md:rounded-r-none bg-fuchsia-blue-500"
							>
								<Minus />
							</Button>

							<Slider
								disabled={!yourTurn}
								defaultValue={[highestBid]}
								value={[bidAmount]}
								onValueChange={handleSliderValueChange}
								className="hidden md:inline-flex bg-fuchsia-blue-900 h-10 px-1"
								max={14}
								step={1}
							/>
							<Button
								disabled={!yourTurn}
								onClick={handleBidIncrease}
								className="m-0 p-0 h-10 w-10 md:rounded-l-none bg-fuchsia-blue-500"
							>
								<Plus />
							</Button>
						</div>
					</div>
					<div className="w-5/12 flex justify-around items-center">
						<Button
							disabled={
								!yourTurn ||
								currPlayerBid + currPlayerBank <= highestBid ||
								bidAmount <= highestBid ||
								communityCards.length === 1
							}
							onClick={bidClick}
							className={cn("m-0 p-0 h-2/3 lg:h-3/4 w-5/12", betActionEnabledStyles)}
						>
							Bid
						</Button>
						<Button
							disabled={!yourTurn}
							onClick={handleMenu}
							className={cn("m-0 p-0 h-2/3 lg:h-3/4 w-5/12", cancelActionEnabledStyles)}
						>
							Cancel
						</Button>
					</div>
				</>
			)}
		</div>
	)
}
