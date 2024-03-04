import { AnimatePresence, Variants, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Home } from "lucide-react"
import { CircleDollarSign } from "lucide-react"
import Image from "next/image"
import { Luckiest_Guy } from "next/font/google"
import { CardType } from "@final-call/shared"
interface CardProps {
	value: string
	position?: number
	labelVisible: boolean
	label?: string
	animateLastCard?: boolean
	cardType: CardType
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const Card = ({ value, labelVisible, label, animateLastCard, cardType, position }: CardProps) => {
	// const labelStyle = labelVisible ? "absolute" : "none"
	const labelStyle = "absolute"

	const cardVariants: Variants = {
		show: { opacity: 1 },
		passed: { opacity: 0, transition: { delay: 0.5 } },
		winner: {
			opacity: 1,
			scale: 1.1,
			transition: {
				repeat: 9,
				repeatType: "mirror",
				delay: 1,
			},
		},
	}

	const labelVariants: Variants = {
		auctionLabelInitial: {
			opacity: 0,
			y: -100,
		},

		auctionLabelAnimate: (index: number) => ({
			opacity: 1,
			y: 0,
			rotate: -45,
			transition: {
				duration: 0.7,
				delay: 0.5 * index,
			},
		}),
	}

	console.log(position)

	return (
		<div className="relative">
			{labelVisible && (
				<motion.div
					className={cn(
						"absolute flex justify-center items-center w-20 h-6 lg:w-24 lg:h-8 text-center bottom-24 lg:bottom-36 -rotate-45 text-sm bg-white rounded",
						labelStyle,
						luckiestGuy.className
					)}
					variants={labelVariants}
					initial={"auctionLabelInitial"}
					animate={"auctionLabelAnimate"}
					custom={position}
				>
					{label}
					<Home />
				</motion.div>
			)}

			<motion.div
				className="relative h-full w-12 md:w-20 bg-white rounded-sm"
				variants={cardVariants}
				initial={{ opacity: 0 }}
				animate={animateLastCard ? "winner" : "show"}
				transition={{ duration: 0.2 }}
				exit={"passed"}
				key={value}
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
		</div>
	)
}
