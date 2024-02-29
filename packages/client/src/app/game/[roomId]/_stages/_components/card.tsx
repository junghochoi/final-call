import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps {
	value: string
	labelVisible: boolean
	label?: string
}

export const Card = ({ value, labelVisible, label }: CardProps) => {
	const labelStyle = labelVisible ? "absolute" : "hidden"
	return (
		<div className="relative">
			<div className={cn("absolute bottom-24 -rotate-45 text-xs w-20 bg-slate-400 rounded", labelStyle)}>{label}</div>
			<motion.div
				className="h-full w-12 md:w-20 border border-black"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.5 } }}
				transition={{ duration: 0.3 }}
				exit={{ opacity: 0 }}
				key={value}
			>
				{value}
			</motion.div>
		</div>
	)
}
