import { cn } from "@/lib/utils"
import { Stage } from "@final-call/shared"

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
}: PlayerBoxProps) => {
	return (
		<>
			<div
				className={cn(
					"absolute w-20 h-14 md:w-28 md:h-18 ",
					positionTailwindStyle,
					playerPresenceTailwindStyle,
					playerTurnTailwindStyle,
					currPlayerTailwindStyle
				)}
			>
				{nickname} - {currPlayerBank}
			</div>

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
