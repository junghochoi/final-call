import { GameState } from "@final-call/shared"
import { BidAction, PassAction, RoomID } from "@final-call/shared"
import { PlayerBox } from "./_components/playerBox"
import { ActionBar } from "./_components/actionBar"
import { Card } from "./_components/card"
interface GameProps {
	gameState: GameState
	roomId: RoomID
	// socket: Socket<ServerToClientEvents, ClientToServerEvents>
	// handleAction: (action: Action) => void
}

const playerBoxPositions = [
	"left-[calc(50%-2.5rem)] bottom-[0.5rem]",
	"left-[0.5rem] bottom-[20%]",
	"left-[0.5rem] top-[20%]",
	"left-[calc(50%-2.5rem)] top-[0.5rem]",
	"right-[0.5rem] top-[20%]",
	"right-[0.5rem] bottom-[20%]",
]

const playerPresentStyle = "bg-blue-300"
const playerAbsentStyle = "bg-gray-300"
const currPlayerStyle = "border-fc-accent border-2"
export const Game = ({ gameState, roomId }: GameProps) => {
	const handleBidAction = (amount: number) => {
		const action: BidAction = {
			roomId: roomId,
			player: gameState.currPlayer!,
			amount,
		}
	}

	const handlePassAction = () => {
		const action: PassAction = {
			roomId: roomId,
			player: gameState.currPlayer!,
		}
	}
	return (
		<div className=" bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
			<div className="relative h-[calc(100%-7em)]">
				<div className="flex justify-center space-x-2 absolute h-14 w-full bg-slate-400 top-[calc(50%-1.75rem)]">
					{gameState.bidState?.roundCards.map((num: number) => (
						<Card value={num} />
					))}
				</div>
				{playerBoxPositions.map((pos, ind) => {
					const name = ind < gameState.players.length ? gameState.players[ind].nickname : `empty`
					// const id = gameState.players[ind].sessionId
					const presence = ind < gameState.players.length ? playerPresentStyle : playerAbsentStyle
					const currPlayer =
						ind < gameState.players.length && gameState.currPlayer?.sessionId == gameState.players[ind].sessionId
							? currPlayerStyle
							: ""

					return (
						<PlayerBox
							positionTailwindStyle={pos}
							playerPresenceTailwindStyle={presence}
							currPlayerTailwindStyle={currPlayer}
							nickname={name}
							key={`player${ind + 1}`}
						/>
					)
				})}
			</div>
			<ActionBar bid={handleBidAction} pass={handlePassAction} />
		</div>
	)
}
