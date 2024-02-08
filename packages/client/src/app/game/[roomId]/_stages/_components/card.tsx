import { AnimatePresence, motion } from "framer-motion"

interface CardProps {
	value: string
}

export const Card = ({ value }: CardProps) => {
	return (
		<motion.div
			className="h-full w-12 md:w-20 border border-black"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1.5 }}
			exit={{ opacity: 0 }}
			key={value}
		>
			{value}
		</motion.div>
	)
}
