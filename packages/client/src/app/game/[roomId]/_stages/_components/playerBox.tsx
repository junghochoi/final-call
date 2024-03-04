import { Variants, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Stage } from "@final-call/shared"
import { WINNER_SOUND_EFFECT_PATH } from "@/lib/soundEffects"

import { useAudio } from "@/hooks/useAudio"
import { Home } from "lucide-react"
import { Luckiest_Guy } from "next/font/google"

const playerBoxPositions = [
	"left-[calc(50%-2.5rem)] md:left-[calc(50%-3.5rem)] bottom-[0.5rem]",
	"left-[0.5rem] bottom-[20%]",
	"left-[0.5rem] top-[20%]",
	"left-[calc(50%-2.5rem)] md:left-[calc(50%-3.5rem)] top-[0.5rem]",
	"right-[0.5rem] top-[20%]",
	"right-[0.5rem] bottom-[20%]",
]

const playerBidPositions = [
	"left-[calc(50%-0.75rem)] bottom-[4.5rem]",
	"left-[6.5rem] md:left-[8rem] bottom-[calc(20%+1rem)]",
	"left-[6.5rem] md:left-[8rem] top-[calc(20%+1rem)]",
	"left-[calc(50%-0.75rem)] top-[4.5rem]",
	"right-[6.5rem] md:right-[8rem] top-[calc(20%+1rem)]",
	"right-[6.5rem] md:right-[8rem] bottom-[calc(20%+1rem)]",
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
		value?: number
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
				<div>{nickname}</div>

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

			{stage === Stage.Auctioning && propertyCard?.value !== undefined && (
				// <div
				// 	className={cn(
				// 		"absolute rounded h-12 w-8 text-sm bg-cyan-300 text-center p-1",
				// 		playerBidPositions[playerPosition]
				// 	)}
				// >
				// 	{propertyCard?.visible && <p>{propertyCard.value}</p>}
				// </div>

				<div
					className={cn("absolute h-12 w-8 bg-white rounded-sm text-xs", playerBidPositions[playerPosition])}
					// initial={{ opacity: 0 }}
					// transition={{ duration: 0.2 }}
					key={propertyCard.value}
				>
					{propertyCard?.visible && (
						<>
							<div className={cn("md:text-2xl pl-1 lg:ml-2", luckiestGuy.className)}>{propertyCard.value}</div>

							<Home
								color="black"
								className="absolute w-9 h-9 lg:w-14 lg:h-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
							/>
						</>
					)}
				</div>
			)}
		</>
	)
}
