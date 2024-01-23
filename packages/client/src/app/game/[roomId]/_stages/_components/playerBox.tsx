import { cn } from "@/lib/utils"

interface PlayerBoxProps {
	positionTailwindStyle: string
	playerPresenceTailwindStyle: string
	currPlayerTailwindStyle?: string
	bidPositionTailwindStyle?: string
	playerTurnTailwindStyle?: string

	nickname?: string
	bid?: number
}

export const PlayerBox = ({
	positionTailwindStyle,
	bidPositionTailwindStyle,
	playerPresenceTailwindStyle,
	playerTurnTailwindStyle,
	currPlayerTailwindStyle,
	nickname,
	bid,
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
				{nickname}
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
		</>
	)
}
