import { cn } from "@/lib/utils"
import { Stage } from "@final-call/shared"
import { Variants, motion } from "framer-motion"

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

const playerPresentStyle = "bg-blue-300"
const playerAbsentStyle = "bg-gray-300"
const currPlayerStyle = "text-white"
const opponentPlayerStyle = "text-black"
const playerTurnStyle = "border-fc-accent border-2"

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
				// delay: 2,
				repeatType: "mirror",
			},
		},
	}

	return (
		<>
			<motion.div
				className={cn(
					"absolute w-20 h-14 md:w-28 md:h-18 ",
					playerBoxPositions[playerPosition],
					playerPresent ? playerPresentStyle : playerAbsentStyle,
					playerTurn ? playerTurnStyle : "",
					currPlayer ? currPlayerStyle : opponentPlayerStyle
				)}
				variants={variants}
				animate={animateWinner ? "animate" : "initial"}
			>
				{nickname} - {currPlayerBank}
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
				<div
					className={cn(
						"absolute rounded h-12 w-8 text-sm bg-cyan-300 text-center p-1",
						playerBidPositions[playerPosition]
					)}
				>
					{propertyCard?.visible && <p>{propertyCard.value}</p>}
				</div>
			)}
		</>
	)
}
