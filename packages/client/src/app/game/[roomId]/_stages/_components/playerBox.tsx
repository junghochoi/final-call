import { cn } from "@/lib/utils"

interface PlayerBoxProps {
	positionTailwindStyle: string
	nickname: string
}

export const PlayerBox = ({ positionTailwindStyle, nickname }: PlayerBoxProps) => {
	return <div className={cn("absolute w-20 h-14 md:w-28 md:h-18 bg-blue-300", positionTailwindStyle)}>{nickname}</div>
}
