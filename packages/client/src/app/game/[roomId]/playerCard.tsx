import { cn } from "@/lib/utils"
import Image from "next/image"

export const PlayerCard = ({
	currPlayer,
	nickname,
	key,
}: {
	currPlayer: boolean
	nickname: string | undefined
	key: any
}) => {
	const playerCardBorder = currPlayer ? `border-fc-accent` : "border-none"
	return (
		<div
			className={cn(
				"flex space-x-3 items-center p-5 bg-fc-blue border-2 shadow-m border-fc-accent",
				playerCardBorder
			)}
			key={key}
		>
			<Image src="/avatar.png" alt="me" width="32" height="32" />
			<h1 className="w-40">{nickname}</h1>
		</div>
	)
}
