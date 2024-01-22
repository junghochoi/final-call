import { GameState } from "@final-call/shared"
import { BidAction, PassAction, RoomID } from "@final-call/shared"
import { PlayerBox } from "./_components/playerBox"
import { ActionBar } from "./_components/actionBar"
import { Card } from "./_components/card"
import { Bird } from "lucide-react"
import { cn } from "@/lib/utils"
interface GameProps {
	gameState: GameState
	roomId: RoomID
	// socket: Socket<ServerToClientEvents, ClientToServerEvents>
	// handleAction: (action: Action) => void
}

const playerBoxPositions = [
	"left-[calc(50%-2.5rem)] md:left-[calc(50%-3.5rem)] bottom-[0.5rem]",
	"left-[0.5rem] bottom-[20%]",
	"left-[0.5rem] top-[20%]",
	"left-[calc(50%-2.5rem)] md:left-[calc(50%-3.5rem)] top-[0.5rem]",
	"right-[0.5rem] top-[20%]",
	"right-[0.5rem] bottom-[20%]",
]

const playerBidPositions = [
	"left-[calc(50%-0.75rem)] bottom-[4.5rem]",
	"left-[6.5rem] md:left-[8rem] bottom-[calc(20%+1rem)]",
	"left-[6.5rem] md:left-[8rem] top-[calc(20%+1rem)]",
	"left-[calc(50%-0.75rem)] top-[4.5rem]",
	"right-[6.5rem] md:right-[8rem] top-[calc(20%+1rem)]",
	"right-[6.5rem] md:right-[8rem] bottom-[calc(20%+1rem)]",
]

const playerPresentStyle = "bg-blue-300"
const playerAbsentStyle = "bg-gray-300"
const currPlayerStyle = "text-white"
const playerTurnStyle = "border-fc-accent border-2"
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

	if (gameState.bidState === undefined) {
		return <p>Game State Loading</p>
	} else {
		console.log(gameState.bidState)
		return (
			<div className=" bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
				<div className="relative h-[calc(100%-7em)]">
					<div className="flex justify-center space-x-4 absolute h-16 md:h-28 : w-full bg-slate-400 top-[calc(50%-2rem)] md:top-[calc(50%-3.5rem)]">
						{gameState.bidState.roundCards.map((num: number) => (
							<Card value={num} />
						))}
					</div>

					{/* {gameState.bidState.playerOrder.map((player, ind) => {
						const pos = playerBoxPositions[ind]
						const currPlayer = player.sessionId === gameState.currPlayer?.sessionId ? currPlayerStyle : ""
						return (
							<PlayerBox
								positionTailwindStyle={pos}
								playerPresenceTailwindStyle={playerPresentStyle}
								currPlayerTailwindStyle={currPlayer}
								nickname={player.nickname}
								key={player.sessionId}
							/>
						)
						
					})} */}

					{playerBoxPositions.map((pos, ind) => {
						const name = ind < gameState.players.length ? gameState.bidState?.playerOrder[ind].nickname! : `empty`
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

					{gameState.bidState.playerOrder.map((player, ind) => {
						const bid = gameState.bidState?.playerBids.get(player.sessionId)
						const visible = bid === 0 ? "hidden" : ""
						return (
							<div
								key={player.sessionId}
								className={cn(
									"absolute rounded h-7 w-6 text-sm bg-cyan-300 text-center p-1",
									playerBidPositions[ind],
									visible
								)}
							>
								{bid}
							</div>
						)
					})}
					{/* 
					{playerBidPositions.map((pos, ind) => {
						return (
							<div key={ind} className={cn("absolute rounded h-7 w-6 text-sm bg-cyan-300 text-center p-1", pos)}>
								{ind}
							</div>
						)
					})} */}
				</div>
				<ActionBar bid={handleBidAction} pass={handlePassAction} />
			</div>
		)
	}
}
