"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"
import { cn, uniqueKey } from "@/lib/utils"
import { CardType, SessionID, Stage } from "@final-call/shared"
import { PersonalCard } from "./PersonalCard"

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
		<div className="h-28 mx-auto w-full border-t border-fuchsia-blue-900 absolute bottom-0 flex justify-between">
			<div className="w-2/3 px-5 lg:px-10 flex justify-start items-center space-x-2">
				{currPlayerPropertyCards.map((card) => (
					<PersonalCard
						value={card}
						color={"black"}
						handleSellProperty={handleSellProperty}
						cardType={CardType.Property}
					/>
				))}
			</div>
			<div className="w-1/3 flex justify-around items-center">
				{currPlayerCashCards.map((card, index) => (
					<PersonalCard
						value={card}
						key={uniqueKey(card, index)}
						color={"black"}
						handleSellProperty={handleSellProperty}
						cardType={CardType.Cash}
					/>
				))}
			</div>
		</div>
	)
}
