"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Stage } from "@final-call/shared"
import { PersonalCard } from "./PersonalCard"

interface ActionBarProps {
	yourTurn: boolean
	currPlayerBank: number
	currPlayerPropertyCards: number[]
	currPlayerBid: number
	highestBid: number
	communityCards: number[]
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

	const handleSellProperty = (card: number) => {
		console.log(`Selling Property ${card}`)
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
					<div className="w-7/12 px-5 lg:px-10 flex justify-start items-center">
						{currPlayerPropertyCards.map((card) => (
							<PersonalCard value={card} color={"black"} />
							// <div key={card} onClick={() => handleSellProperty(card)} className="p-4 border-2 border-black">
							// 	{card}
							// </div>
						))}
					</div>
					<div className="w-5/12 flex justify-around items-center">
						{stage === Stage.Bidding && <></>}
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
						<div className={cn("p-4", validBidStyle)}>
							<p className="text-2xl text-center p-2 w-3/5 lg:w-2/5">${bidAmount}</p>
						</div>
						<div className="space-y-1 space-y-reverse flex flex-col-reverse items-center justify-around lg:bg-pink-500 lg:flex-row w-2/5 lg:w-3/5 lg:space-y-0">
							<Button disabled={!yourTurn} onClick={handleBidDecrease} className="m-0 p-0 h-10 w-10 lg:rounded-r-none">
								<Minus />
							</Button>

							<Slider
								disabled={!yourTurn}
								value={[highestBid]}
								onValueChange={handleSliderValueChange}
								className="hidden lg:inline-flex bg-gray-600 h-10 px-1"
								max={14}
								step={1}
							/>
							<Button disabled={!yourTurn} onClick={handleBidIncrease} className="m-0 p-0 h-10 w-10 lg:rounded-l-none">
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
