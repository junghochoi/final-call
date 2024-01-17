import { cn } from "@/lib/utils"

interface PlayerBoxProps {
	positionTailwindStyle: string
	playerPresenceTailwindStyle: string
	currPlayerTailwindStyle: string
	nickname: string
}

export const PlayerBox = ({
	positionTailwindStyle,
	playerPresenceTailwindStyle,
	currPlayerTailwindStyle,
	nickname,
}: PlayerBoxProps) => {
	return (
		<div
			className={cn(
				"absolute w-20 h-14 md:w-28 md:h-18 ",
				positionTailwindStyle,
				playerPresenceTailwindStyle,
				currPlayerTailwindStyle
			)}
		>
			{nickname}
		</div>
	)
}
