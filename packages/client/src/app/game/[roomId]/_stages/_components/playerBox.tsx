import { cn } from "@/lib/utils"

interface PlayerBoxProps {
	positionTailwindStyle: string
	playerPresenceTailwindStyle: string
	nickname: string
}

export const PlayerBox = ({ positionTailwindStyle, playerPresenceTailwindStyle, nickname }: PlayerBoxProps) => {
	return (
		<div className={cn("absolute w-20 h-14 md:w-28 md:h-18 ", positionTailwindStyle, playerPresenceTailwindStyle)}>
			{nickname}
		</div>
	)
}
