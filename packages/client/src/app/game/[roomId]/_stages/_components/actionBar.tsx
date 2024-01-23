"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionBarProps {
	yourTurn: boolean
	currPlayerBank: number
	highestBid: number
	bid: (amount: number) => void
	pass: () => void
}

export const ActionBar = ({ bid, pass, yourTurn, currPlayerBank, highestBid }: ActionBarProps) => {
	const [bidAmount, setBidAmount] = useState<number>(Math.min(highestBid, currPlayerBank))
	const [bidMenuOpen, setBidMenuOpen] = useState<boolean>(false)

	useEffect(() => {
		setBidAmount(Math.min(highestBid, currPlayerBank))
	}, [highestBid])

	const bidClick = () => {
		setBidMenuOpen(false)
		bid(bidAmount)
	}

	const passClick = () => {}

	const handleBidIncrease = () => {
		// if (bidAmount >= currPlayerBank) return
		// setBidAmount(bidAmount)
		setBidAmount((prev) => Math.min(currPlayerBank, prev + 1))
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

	const actionEnabledStyles = yourTurn ? "bg-black" : "bg-gray-400"
	const validBidStyle = highestBid < bidAmount && bidAmount <= currPlayerBank ? "bg-green-500" : "bg-red-500"

	return (
		<div className="h-28 mx-auto w-full bg-red-200 absolute bottom-0 flex justify-between">
			{!bidMenuOpen && (
				<>
					<div className="w-7/12 bg-blue-300">
						<p>Cards</p>
					</div>
					<div className="w-5/12 flex justify-around items-center">
						<Button
							disabled={!yourTurn}
							onClick={pass}
							className={cn("m-0 p-0 h-2/3 lg:h-3/4 w-5/12", actionEnabledStyles)}
						>
							Pass
						</Button>
						<Button
							disabled={!yourTurn || currPlayerBank < highestBid}
							onClick={handleMenu}
							className={cn("m-0 p-0 h-2/3 lg:h-3/4 w-5/12", actionEnabledStyles)}
						>
							Bid
						</Button>
					</div>
				</>
			)}

			{bidMenuOpen && (
				<>
					<div className="w-7/12 bg-blue-300 p-4 flex justify-around">
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
							disabled={!yourTurn || currPlayerBank < bidAmount || bidAmount <= highestBid}
							onClick={bidClick}
							className={cn("m-0 p-0 h-2/3 lg:h-3/4 w-5/12", actionEnabledStyles)}
						>
							Bid
						</Button>
						<Button
							disabled={!yourTurn}
							onClick={handleMenu}
							className={cn("m-0 p-0 h-2/3 lg:h-3/4 w-5/12", actionEnabledStyles)}
						>
							Cancel
						</Button>
					</div>
				</>
			)}
		</div>
	)
}
