import { useSocket } from "@/contexts/SocketContext"
import { cn } from "@/lib/utils"
import { Stage } from "@final-call/shared"
import { Variants, motion } from "framer-motion"
import { useParams } from "next/navigation"

interface PlayerBoxProps {
	positionTailwindStyle: string
	playerPresenceTailwindStyle: string
	currPlayerTailwindStyle?: string
	bidPositionTailwindStyle?: string
	playerTurnTailwindStyle?: string

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
	positionTailwindStyle,
	bidPositionTailwindStyle,
	playerPresenceTailwindStyle,
	playerTurnTailwindStyle,
	currPlayerTailwindStyle,
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

	const { socket } = useSocket()
	const { roomId } = useParams<{ roomId: string }>()

	const onAnimationComplete = () => {
		console.log("Emitting EndRoundAnimation")
		socket.emit("EndRoundAnimation", { roomId })
	}

	return (
		<>
			<motion.div
				className={cn(
					"absolute w-20 h-14 md:w-28 md:h-18 ",
					positionTailwindStyle,
					playerPresenceTailwindStyle,
					playerTurnTailwindStyle,
					currPlayerTailwindStyle
				)}
				variants={variants}
				animate={animateWinner ? "animate" : "initial"}
				onAnimationComplete={onAnimationComplete}
			>
				{nickname} - {currPlayerBank}
			</motion.div>

			<div
				className={cn(
					"absolute rounded h-7 w-6 text-sm bg-cyan-300 text-center p-1",
					bidPositionTailwindStyle,
					bid ? "visible" : "invisible"
				)}
			>
				{bid}
			</div>

			{stage === Stage.Auctioning && propertyCard?.value !== undefined && (
				<div className={cn("absolute rounded h-12 w-8 text-sm bg-cyan-300 text-center p-1", bidPositionTailwindStyle)}>
					{propertyCard?.visible && <p>{propertyCard.value}</p>}
				</div>
			)}
		</>
	)
}
