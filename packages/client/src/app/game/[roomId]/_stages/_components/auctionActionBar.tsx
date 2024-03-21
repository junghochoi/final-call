"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"
import { cn, uniqueKey } from "@/lib/utils"
import { Card, CardType, SessionID, Stage } from "@final-call/shared"
import { PersonalCard } from "./PersonalCard"
import { unique } from "next/dist/build/utils"

interface AuctionActionBarProps {
	currPlayerPropertyCards: Card[]
	currPlayerCashCards: Card[]

	sell: (amount: Card) => void
	canTakeAction: boolean
}

export const AuctionActionBar = ({
	currPlayerPropertyCards,
	currPlayerCashCards,
	sell,
	canTakeAction,
}: AuctionActionBarProps) => {
	const [selectedCard, setSelectedCard] = useState<string>("")
	const handleSellProperty = (card: Card) => {
		console.log(window.innerWidth)
		if (window.innerWidth < 640 && selectedCard !== card.id) {
			setSelectedCard(card.id)
		} else if (canTakeAction) {
			sell(card)
		}
	}

	return (
		<div className="h-28 mx-auto w-full border-t border-fuchsia-blue-900 absolute bottom-0 flex justify-between">
			<div className="w-full px-5 lg:px-10 flex justify-start items-center space-x-2">
				{currPlayerPropertyCards
					.sort((a, b) => a.value - b.value)
					.map((card, index) => (
						<PersonalCard
							card={card}
							key={card.id}
							handleSellProperty={handleSellProperty}
							selected={selectedCard === card.id}
						/>
					))}
				<div className="inline-block h-full py-3  w-0.5 self-stretch bg-fuchsia-blue-900 dark:bg-white/10"></div>
				{currPlayerCashCards
					.sort((a, b) => a.value - b.value)
					.map((card, index) => (
						<PersonalCard card={card} key={card.id} />
					))}
			</div>
		</div>
	)
}
