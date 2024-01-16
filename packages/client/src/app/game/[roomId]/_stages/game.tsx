import { GameState } from "../page"
import { ActionBar } from "./_components/actionBar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { PlayerBox } from "./_components/playerBox"
import { getNickname } from "@/lib/utils"

interface GameProps {
	gameState: GameState
}

const playerBoxPositions = [
	"left-[calc(50%-2.5rem)] bottom-[0.5rem]",
	"left-[0.5rem] bottom-[20%]",
	"left-[0.5rem] top-[20%]",
	"left-[calc(50%-2.5rem)] top-[0.5rem]",
	"right-[0.5rem] top-[20%]",
	"right-[0.5rem] bottom-[20%]",
]
export const Game = ({ gameState }: GameProps) => {
	return (
		<div className="bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
			<div className="relative h-[calc(100%-7em)]">
				<div className=" absolute h-14 w-full bg-slate-400 top-[calc(50%-1.75rem)]">Community Cards</div>
				{playerBoxPositions.map((pos, ind) => {
					if (ind < gameState.players.length) {
						return <PlayerBox positionTailwindStyle={pos} nickname={gameState.players[ind].nickname} />
					} else {
						return <PlayerBox positionTailwindStyle={pos} nickname={`Player ${ind + 1}`} />
					}
				})}
			</div>
			<ActionBar />
		</div>
	)
}
