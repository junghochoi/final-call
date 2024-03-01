"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { SessionID, Stage } from "@final-call/shared"
import { PersonalCard } from "./PersonalCard"

interface AuctionActionBarProps {
	currPlayerPropertyCards: number[]
	currPlayerCashCards: number[]

	sell: (amount: number) => void
	canTakeAction: boolean

	playerSellingPropertyCard: Map<string, number>
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
		<div className="h-28 mx-auto w-full absolute bottom-0 flex justify-between">
			<div className="w-2/3 px-5 lg:px-10 flex justify-start items-center space-x-2">
				{currPlayerPropertyCards.map((card) => (
					<PersonalCard value={card} color={"black"} handleSellProperty={handleSellProperty} />

					// <div key={card} onClick={() => handleSellProperty(card)} className="p-4 border-2 border-black">
					// 	{card}
					// </div>
				))}
			</div>
			<div className="w-1/3 flex justify-around items-center">
				{currPlayerCashCards.map((card) => (
					<div key={card} className="p-4 border-2 border-black">
						{card}
					</div>
				))}
			</div>
		</div>
	)
}
