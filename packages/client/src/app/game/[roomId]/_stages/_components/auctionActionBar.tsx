"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { SessionID, Stage } from "@final-call/shared"

interface AuctionActionBarProps {
	currPlayerPropertyCards: number[]
	currPlayerCashCards: number[]

	sell: (amount: number) => void
	canTakeAction: boolean
}

export const AuctionActionBar = ({
	currPlayerPropertyCards,
	currPlayerCashCards,
	sell,
	canTakeAction,
}: AuctionActionBarProps) => {
	const handleSellProperty = (card: number) => {
		if (canTakeAction) {
			sell(card)
		}
	}

	return (
		<div className="h-28 mx-auto w-full bg-red-200 absolute bottom-0 flex justify-between">
			<div className="w-2/3 px-5 lg:px-10 bg-blue-300 flex justify-start items-center">
				{currPlayerPropertyCards.map((card) => (
					<div key={card} onClick={() => handleSellProperty(card)} className="p-4 border-2 border-black">
						{card}
					</div>
				))}
			</div>
			<div className="w-1/3flex justify-around items-center">
				{currPlayerCashCards.map((card) => (
					<div key={card} className="p-4 border-2 border-black">
						{card}
					</div>
				))}
			</div>
		</div>
	)
}
