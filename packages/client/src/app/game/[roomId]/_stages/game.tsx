import { GameState } from "../page"
import { ActionBar } from "./_components/actionBar"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface GameProps {
	gameState: GameState
}
export const Game = ({ gameState }: GameProps) => {
	return (
		<div className="bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
			<div className="relative h-[calc(100%-7em)]">
				<div className=" absolute h-14 w-full bg-slate-400 top-[calc(50%-1.75rem)]">Community Cards</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-18 bg-blue-300 left-[calc(50%-2.5rem)] top-[0.5rem]">
					<p>Player Number 4</p>
				</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-18 bg-blue-300 left-[0.5rem] top-[20%]">
					<p>Player Number 3</p>
				</div>

				<div className="absolute w-20 h-14 md:w-28 md:h-18 bg-blue-300 right-[0.5rem] bottom-[20%]">
					<p>Player Number 2</p>
				</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-18 bg-blue-300 left-[0.5rem] bottom-[20%]">
					<p>Player Number 1</p>
				</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-18 bg-blue-300 left-[calc(50%-2.5rem)] bottom-[0.5rem]">
					<p>Player Number 5</p>
				</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-18 bg-blue-300 right-[0.5rem] top-[20%]">
					<p>Player Number 6</p>
				</div>
			</div>
			<ActionBar />
		</div>
	)
}
