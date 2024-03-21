import { AnimatePresence, Variants, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, Stage } from "@final-call/shared"
import { WINNER_SOUND_EFFECT_PATH } from "@/lib/soundEffects"

import { useAudio } from "@/hooks/useAudio"
import { Home } from "lucide-react"
import { Luckiest_Guy } from "next/font/google"

const playerBoxPositions = [
	"left-[calc(50%-2.5rem)] md:left-[calc(50%-4rem)] bottom-[0.5rem]", // Bottom
	"left-[0.5rem] bottom-[20%]", // Bottom Left
	"left-[0.5rem] top-[20%]", // Top Left
	"left-[calc(50%-2.5rem)] md:left-[calc(50%-4rem)] top-[0.5rem]", // Top
	"right-[0.5rem] top-[20%]", // Top Right
	"right-[0.5rem] bottom-[20%]", // Bottom Right
]

const playerBidPositions = [
	"left-[calc(50%-0.75rem)] bottom-[4.5rem]", // Bottom
	"left-[6.5rem] md:left-[10rem] bottom-[calc(20%+1rem)]", // Bottom Left
	"left-[6.5rem] md:left-[10rem] top-[calc(20%+1rem)]", // Bottom Left
	"left-[calc(50%-0.75rem)] top-[4.5rem]", // Top
	"right-[6.5rem] md:right-[10rem] top-[calc(20%+1rem)]", // Top Right
	"right-[6.5rem] md:right-[10rem] bottom-[calc(20%+1rem)]", // Bottom Right
]

const playerPresentStyle = ""
const playerAbsentStyle = "border border-dashed border-fuchsia-blue-800"
// const currPlayerStyle = ""
// const opponentPlayerStyle = "bg-gray-800 text-white"
const playerTurnStyle = "bg-white shadow-gray-200 text-black shadow-[rgba(255,_255,_255,_1)_0px_0px_16px]"
const playerWaitStyle = "bg-none text-white border"

interface PlayerBoxProps {
	playerPosition: number
	playerPresent: boolean
	currPlayer: boolean
	playerTurn: boolean

	stage: Stage
	currPlayerBank?: number

	nickname?: string
	bid?: number
	propertyCard?: {
		value?: Card
		visible: boolean
	}

	animateWinner: boolean
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const PlayerBox = ({
	playerPosition,
	playerPresent,
	playerTurn,
	currPlayer,
	nickname,
	bid,
	currPlayerBank,
	propertyCard,
	stage,
	animateWinner,
}: PlayerBoxProps) => {
	const variants: Variants = {
		initial: { opacity: 1, scale: 1 },
		animate: {
			opacity: 1,
			scale: 1.1,
			transition: {
				repeat: 9,
				repeatType: "mirror",
				delay: 1, // Need to change in
			},
		},
	}

	const winnerSound = useAudio(WINNER_SOUND_EFFECT_PATH)

	return (
		<>
			<motion.div
				className={cn(
					"absolute w-20 h-14 md:w-32 md:h-18 rounded-lg p-1 flex justify-evenly items-center",
					playerBoxPositions[playerPosition],
					playerPresent ? playerPresentStyle : playerAbsentStyle,
					playerTurn ? playerTurnStyle : playerWaitStyle
					// currPlayer ? currPlayerStyle : opponentPlayerStyle
				)}
				onAnimationStart={() => {
					setTimeout(() => {
						animateWinner && winnerSound.play()
					}, 1000)
				}}
				variants={variants}
				animate={animateWinner ? "animate" : "initial"}
			>
				<div className="text-xs">{nickname}</div>

				{currPlayer && <div className="p-1 rounded-full bg-sky-300 text-sm">${currPlayerBank}</div>}
			</motion.div>
			<div
				className={cn(
					"absolute rounded h-7 w-6 text-sm bg-cyan-300 text-center p-1",
					playerBidPositions[playerPosition],
					bid ? "visible" : "invisible"
				)}
			>
				{bid}
			</div>
			<AnimatePresence>
				{stage === Stage.Auctioning && propertyCard?.value !== undefined && (
					// <div
					// 	className={cn(
					// 		"absolute rounded h-12 w-8 text-sm bg-cyan-300 text-center p-1",
					// 		playerBidPositions[playerPosition]
					// 	)}
					// >
					// 	{propertyCard?.visible && <p>{propertyCard.value}</p>}
					// </div>

					<motion.div
						className={cn("absolute h-14 w-10 bg-white rounded-sm text-sm", playerBidPositions[playerPosition])}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.7 }}
						exit={{ opacity: 0, transition: { duration: 0.7 } }}
						key={propertyCard.value.value}
					>
						{propertyCard?.visible && (
							<>
								<div className={cn("ml-1 mb-3", luckiestGuy.className)}>{propertyCard.value.value}</div>

								<Home color="black" className="absolute w-7 h-7  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
