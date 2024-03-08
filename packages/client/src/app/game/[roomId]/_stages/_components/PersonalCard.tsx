"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CircleDollarSign, Home } from "lucide-react"
import { Luckiest_Guy } from "next/font/google"
import { CardType } from "@final-call/shared"
interface CardProps {
	value: number
	color: string
	cardType: CardType
	cardId: string

	handleSellProperty?: (value: number, key: string) => void
	selected?: boolean
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const PersonalCard = ({ value, color, handleSellProperty, cardType, cardId, selected }: CardProps) => {
	// const labelStyle = labelVisible ? "absolute" : "hidden"

	const sell = () => {
		handleSellProperty && handleSellProperty(value, cardId)
	}

	const cardStyle = selected ? "opacity-100" : "opacity-50"
	return (
		<motion.div
			className={cn("relative h-2/3 w-12 lg:w-16 bg-white rounded-sm opacity-50 hover:opacity-100", cardStyle)}
			// initial={{ opacity: 0 }}
			// animate={{ opacity: 1, transition: { delay: 0.5 } }}
			// transition={{ duration: 0.2 }}
			// exit={{ opacity: 0 }}
			key={value}
			onClick={sell}
		>
			<div className={cn("md:text-2xl ml-1 ", luckiestGuy.className)}>{value}</div>
			{cardType === CardType.Property && (
				<Home
					color="black"
					className="absolute w-9 h-9 lg:w-14 lg:h-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				/>
			)}

			{cardType === CardType.Cash && (
				<CircleDollarSign
					color="black"
					className="absolute w-9 h-9 lg:w-14 lg:h-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				/>
			)}
		</motion.div>
	)
}
