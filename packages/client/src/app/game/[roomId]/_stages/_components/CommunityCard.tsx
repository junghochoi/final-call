"use client"

import { AnimatePresence, Variants, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Home } from "lucide-react"
import { CircleDollarSign } from "lucide-react"
import Image from "next/image"
import { Luckiest_Guy } from "next/font/google"
import { Card, CardType } from "@final-call/shared"
interface CardProps {
	card: Card
	position?: number
	labelVisible: boolean
	label?: string
	animateLastCard?: boolean
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const CommunityCard = ({ card, labelVisible, label, animateLastCard, position }: CardProps) => {
	// const labelStyle = labelVisible ? "absolute" : "none"
	const labelStyle = "absolute"

	const cardVariants: Variants = {
		show: { opacity: 1 },
		passed: (isDelayed) => {
			return { opacity: 0, transition: { duration: 0.7 * isDelayed } }
		},
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
		auctionLabelExit: {
			opacity: 0,
			transition: {
				duration: 0.7,
			},
		},
	}
	return (
		<div className="relative">
			<AnimatePresence>
				{labelVisible && (
					<motion.div
						className={cn(
							"absolute flex justify-center items-center w-20 h-6 lg:w-24 lg:h-8 text-center bottom-24 md:bottom-36 -rotate-45 text-sm bg-white rounded",
							labelStyle,
							luckiestGuy.className
						)}
						variants={labelVariants}
						initial={"auctionLabelInitial"}
						animate={"auctionLabelAnimate"}
						exit={"auctionLabelExit"}
						custom={position}
						key={card.id}
					>
						{label}
						<Home />
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div
				className="relative h-full w-12 md:w-20 bg-white rounded-sm"
				variants={cardVariants}
				initial={{ opacity: 0 }}
				animate={animateLastCard ? "winner" : "show"}
				transition={{ duration: 0.7 }}
				exit={"passed"}
				custom={animateLastCard ? 1 : 0}
			>
				<div className={cn("md:text-2xl pl-1 md:ml-2 md:pt-2", luckiestGuy.className)}>{card.value}</div>

				{card.type === CardType.Property && (
					<Home
						color="black"
						className="absolute w-9 h-9 md:h-14 md:w-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					/>
				)}

				{card.type === CardType.Cash && (
					<CircleDollarSign
						color="black"
						className="absolute w-9 h-9 md:w-14 md:h-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					/>
				)}
			</motion.div>
		</div>
	)
}
