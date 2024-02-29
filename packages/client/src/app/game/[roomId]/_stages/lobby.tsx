import { Button } from "@/components/ui/button"
import { PlayerCard } from "../playerCard"
import { GameState } from "@final-call/shared"
import { Player } from "@final-call/shared"
import { Luckiest_Guy } from "next/font/google"
import { cn } from "@/lib/utils"

interface LobbyProps {
	gameState: GameState
	handleStartGame: () => void
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const Lobby = ({ gameState, handleStartGame }: LobbyProps) => {
	return (
		<div className="bg-tolopea-950">
			<div className="flex  items-center flex-col lg:max-w-screen-md mx-auto min-h-screen p-12">
				<h1 className={cn("mb-20 text-white text-4xl lg:text-6xl", luckiestGuy.className)}>Lobby</h1>

				<div className="flex items-center justify-center space-y-5 lg:space-x-5 lg:items-start lg:space-y-0 flex-col lg:flex-row w-full ">
					<div className="flex bg-fuchsia-blue-900 w-full lg:w-1/2 rounded-md">
						<ul className="space-y-2 p-2 shadow-lg">
							{gameState.players.map((player: Player) => (
								<PlayerCard
									currPlayer={player.sessionId == gameState.currPlayer?.sessionId}
									player={player}
									key={player.sessionId}
								/>
							))}
						</ul>
					</div>

					<div className="bg-fuchsia-blue-900 w-full lg:w-1/2  min-h-80 relative rounded-md p-2">
						<h1 className={cn("text-white font-thin", luckiestGuy.className)}>Settings</h1>
						<div></div>

						<Button
							onClick={handleStartGame}
							className="w-full bg-fuchsia-blue-400 shadow-md hover:bg-fuchsia-blue-300"
						>
							Start Game
						</Button>

						{/* {!gameState.currPlayer?.host && <Button className="w-full"></Button>} */}
					</div>
				</div>
			</div>
		</div>
	)
}
