import { useSocket } from "@/contexts/SocketContext"
import { GameState, PlayerResultState, SessionID, Stage } from "@final-call/shared"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"

interface ResultProps {
	gameState: GameState
}
export const Results = ({ gameState }: ResultProps) => {
	const { socket } = useSocket()
	const { roomId } = useParams<{ roomId: string }>()

	const returnToLobby = () => {
		socket.emit("StageChange", { roomId: roomId, stage: Stage.Lobby })
	}
	return (
		<div>
			{Array.from(gameState.resultState!.entries()).map(([sessionId, resultState]) => {
				return (
					<div>
						<p>{sessionId}</p>
						<p>Bank: {resultState.bank}</p>
						<ol>
							{resultState.cashCards.map((val) => (
								<ul>{val}</ul>
							))}
						</ol>
					</div>
				)
			})}

			<Button onClick={returnToLobby}>Return to Lobby</Button>
		</div>
	)
}
