import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CircleDollarSign, Home } from "lucide-react"
import { Luckiest_Guy } from "next/font/google"
import { CardType } from "@final-call/shared"
interface CardProps {
	value: number
	color: string
	cardType: CardType

	handleSellProperty?: (value: number) => void
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const PersonalCard = ({ value, color, handleSellProperty, cardType }: CardProps) => {
	// const labelStyle = labelVisible ? "absolute" : "hidden"

	const sell = () => {
		handleSellProperty && handleSellProperty(value)
	}
	return (
		<motion.div
			className="relative h-2/3 w-12 md:w-20 bg-white rounded-sm opacity-50"
			// initial={{ opacity: 0 }}
			// animate={{ opacity: 1, transition: { delay: 0.5 } }}
			// transition={{ duration: 0.2 }}
			// exit={{ opacity: 0 }}
			key={value}
			onClick={sell}
		>
			<div className={cn("md:text-2xl pl-1 lg:ml-2", luckiestGuy.className)}>{value}</div>
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
