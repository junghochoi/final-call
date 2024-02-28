import { cn } from "@/lib/utils"
import { Player } from "@final-call/shared"
import Image from "next/image"
import { Crown } from "lucide-react"

export const PlayerCard = ({
	currPlayer,
	player,
}: {
	currPlayer: boolean
	player: Player
	// nickname: string | undefined
}) => {
	const currPlayerStyle = currPlayer ? `text-lavender-magenta-300` : "text-white"
	return (
		<div className={cn("flex space-x-3 items-center p-5 bg-fc-blue text-white", currPlayerStyle)}>
			<Image src="/avatar.png" alt="me" width="32" height="32" />
			<Crown className={player.host ? "inline-block" : "hidden"} size={20} />
			<span>{player.nickname}</span>
		</div>
	)
}
