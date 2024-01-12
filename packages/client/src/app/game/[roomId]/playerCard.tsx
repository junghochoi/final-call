import { cn } from "@/lib/utils"

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
				"p-5 bg-fc-blue border-2 shadow-m border-fc-accent",
				playerCardBorder
			)}
			key={key}
		>
			<h1>{nickname}</h1>
			<span>$14</span>
		</div>
	)
}
