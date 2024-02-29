import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Home } from "lucide-react"
import Image from "next/image"
import { Luckiest_Guy } from "next/font/google"
interface CardProps {
	value: number
	color: string

	handleSellProperty?: () => void
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const PersonalCard = ({ value, color }: CardProps) => {
	// const labelStyle = labelVisible ? "absolute" : "hidden"
	return (
		<motion.div
			className="relative h-2/3 w-12 md:w-20 bg-white rounded-sm opacity-50"
			// initial={{ opacity: 0 }}
			// animate={{ opacity: 1, transition: { delay: 0.5 } }}
			// transition={{ duration: 0.2 }}
			// exit={{ opacity: 0 }}
			key={value}
		>
			<div className={cn("md:text-2xl pl-1 lg:ml-2", luckiestGuy.className)}>{value}</div>
			<Home
				color={color}
				className="absolute w-9 h-9 lg:w-14 lg:h-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
		</motion.div>
	)
}
