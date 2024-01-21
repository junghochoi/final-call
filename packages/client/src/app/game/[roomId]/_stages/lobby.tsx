import { Button } from "@/components/ui/button"
import { PlayerCard } from "../playerCard"
import { GameState } from "@final-call/shared"
import { Player } from "@final-call/shared"

interface LobbyProps {
	gameState: GameState
	handleStartGame: () => void
}

export const Lobby = ({ gameState, handleStartGame }: LobbyProps) => {
	return (
		<div className="flex justify-center items-center flex-col lg:max-w-screen-lg mx-auto h-screen bg-blue-400">
			<p>Game Page</p>

			<div className="flex w-2/3">
				<ul className="w-1/2 space-y-2">
					{gameState.players.map((player: Player) => (
						<PlayerCard
							currPlayer={player.sessionId == gameState.currPlayer?.sessionId}
							player={player}
							key={player.sessionId}
						/>
					))}
				</ul>

				<div className="bg-green-200 w-1/2 min-h-80 relative">
					<h1>Settings</h1>
					<div>
						{gameState.currPlayer?.host && (
							<Button onClick={handleStartGame} className="absolute bottom-3 w-full">
								Play
							</Button>
						)}

						{!gameState.currPlayer?.host && <Button className="absolute bottom-3 w-full">Waiting for host...</Button>}
					</div>
				</div>
			</div>
		</div>
	)
}
