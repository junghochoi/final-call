import { useSocket } from "@/contexts/SocketContext"
import { GameState, PlayerResultState, SessionID, Stage } from "@final-call/shared"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface ResultProps {
	gameState: GameState
}

const VerticalBar = ({ numBars }: { numBars: number }) => {
	const barWidthStyle = numBars <= 3 ? "w-32" : "w-16"
	return (
		<div className={cn("relative flex flex-col items-center flex-grow pb-5 group", barWidthStyle)}>
			<span className="absolute top-0 hidden -mt-6 text-xs font-bold group-hover:block">$75,000</span>
			<div className="relative flex justify-center w-full h-12 bg-indigo-200"></div>
			<div className="relative flex justify-center w-full h-8 bg-indigo-300"></div>
			<div className="relative flex justify-center w-full h-40 bg-indigo-400"></div>
			<span className="absolute bottom-0 text-xs font-bold -rotate-45 ">AAAAAAAAA</span>
		</div>
	)
}

export const Results = ({ gameState }: ResultProps) => {
	const { socket } = useSocket()
	const { roomId } = useParams<{ roomId: string }>()

	console.log(gameState.resultState)
	const returnToLobby = () => {
		socket.emit("StageChange", { roomId: roomId, stage: Stage.Lobby })
	}

	return (
		<div className="bg-[#1F002E] h-screen text-white flex items-center justify-center flex-col">
			<div className="flex flex-col max-w-screen-md items-center justify-center p-6 pb-6 rounded-lg shadow-xl sm:p-8">
				<h2 className="text-xl font-bold">Standings</h2>
				<span className="text-sm font-semibold text-gray-500">2020</span>
				<div className="flex items-end flex-grow w-full mt-2 space-x-2 sm:space-x-3">
					<VerticalBar numBars={3} />
					<VerticalBar numBars={3} />
					<VerticalBar numBars={3} />
					<VerticalBar numBars={3} />
					<VerticalBar numBars={3} />
					<VerticalBar numBars={3} />
				</div>
				{/* <div className="flex w-full mt-3">
					<div className="flex items-center ml-auto">
						<span className="block w-4 h-4 bg-indigo-400"></span>
						<span className="ml-1 text-xs font-medium">Existing</span>
					</div>
					<div className="flex items-center ml-4">
						<span className="block w-4 h-4 bg-indigo-300"></span>
						<span className="ml-1 text-xs font-medium">Upgrades</span>
					</div>
					<div className="flex items-center ml-4">
						<span className="block w-4 h-4 bg-indigo-200"></span>
						<span className="ml-1 text-xs font-medium">New</span>
					</div>
				</div> */}
			</div>

			<Button onClick={returnToLobby}>Return to Lobby</Button>
		</div>
	)
}
