import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Home } from "lucide-react"
import Image from "next/image"
import { Luckiest_Guy } from "next/font/google"
interface CardProps {
	value: string
	labelVisible: boolean
	label?: string
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const Card = ({ value, labelVisible, label }: CardProps) => {
	const labelStyle = labelVisible ? "absolute" : "hidden"
	return (
		<div className="relative">
			<div className={cn("absolute bottom-24 -rotate-45 text-xs w-20 bg-slate-400 rounded", labelStyle)}>{label}</div>
			<motion.div
				className="relative h-full w-12 md:w-20 bg-white rounded-sm"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.5 } }}
				transition={{ duration: 0.2 }}
				exit={{ opacity: 0 }}
				key={value}
			>
				<div className={cn("md:text-2xl pl-1 lg:ml-2", luckiestGuy.className)}>{value}</div>
				<Home
					color="black"
					className="absolute w-9 h-9 lg:w-14 lg:h-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				/>
			</motion.div>
		</div>
	)
}
