import { GameState } from "../page"
import { ActionBar } from "./_components/actionBar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { PlayerBox } from "./_components/playerBox"
import { getNickname } from "@/lib/utils"

interface GameProps {
	gameState: GameState
	// handleGameAction: () => void
}

const playerBoxPositions = [
	"left-[calc(50%-2.5rem)] bottom-[0.5rem]",
	"left-[0.5rem] bottom-[20%]",
	"left-[0.5rem] top-[20%]",
	"left-[calc(50%-2.5rem)] top-[0.5rem]",
	"right-[0.5rem] top-[20%]",
	"right-[0.5rem] bottom-[20%]",
]

const playerPresent = "bg-blue-300"
const playerAbsent = "bg-gray-300"
export const Game = ({ gameState }: GameProps) => {
	const handleBid = () => {
		console.log()
	}

	const handlePass = () => {
		console.log()
	}
	return (
		<div className="bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
			<div className="relative h-[calc(100%-7em)]">
				<div className=" absolute h-14 w-full bg-slate-400 top-[calc(50%-1.75rem)]">Community Cards</div>
				{playerBoxPositions.map((pos, ind) => {
					const name = ind < gameState.players.length ? gameState.players[ind].nickname : `empty`
					// const id = gameState.players[ind].sessionId
					const presence = ind < gameState.players.length ? playerPresent : playerAbsent

					return (
						<PlayerBox
							positionTailwindStyle={pos}
							playerPresenceTailwindStyle={presence}
							nickname={name}
							key={`player${ind + 1}`}
						/>
					)
				})}
			</div>
			<ActionBar bid={handleBid} pass={handlePass} />
		</div>
	)
}
