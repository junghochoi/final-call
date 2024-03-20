import { useSocket } from "@/contexts/SocketContext"
import { GameState, PlayerResultState, SessionID, Stage } from "@final-call/shared"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { heightStyle, backgroundStyle } from "@/lib/dynamicStyles"
import { motion } from "framer-motion"
import { Luckiest_Guy, Poppins } from "next/font/google"
import { INCREASE_SOUND_EFFECT_PATH } from "@/lib/soundEffects"
import { useAudio } from "@/hooks/useAudio"

interface ResultProps {
	gameState: GameState
}

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["700"],
})

const VerticalBar = ({ numBars, stack, nickname }: { numBars: number; stack: number[]; nickname: string }) => {
	const barWidthStyle = numBars <= 3 ? "w-32" : "w-14"

	return (
		<motion.div
			className={cn("relative flex flex-col items-center flex-grow pb-5 group", barWidthStyle)}
			animate={{
				transition: {
					staggerChildren: 3,
				},
			}}
		>
			<span className="absolute top-0 hidden -mt-6 text-xs font-bold group-hover:block">
				{stack.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
			</span>
			{stack.reverse().map((value: number, index) => {
				const delay = (stack.length - index) * 3

				return (
					<motion.div
						key={`${value}_${index}`}
						className={cn(
							"relative flex flex-col justify-center w-full",
							backgroundStyle[(index + 1) * 100],
							heightStyle[value]
						)}
						initial={{ height: 0 }}
						animate={{ height: value * 4, transition: { delay: delay, duration: 1 } }}
					>
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: delay, duration: 2 } }}
							className={cn("text-center text-black", poppins.className)}
						>
							{value}
						</motion.span>
					</motion.div>
				)
			})}
			<span className="absolute bottom-0 text-xs font-bold -rotate-45 ">{nickname}</span>
		</motion.div>
	)
}

type PlayerResultData = {
	sessionId: SessionID
	nickname: string
	data: number[]
}

export const Results = ({ gameState }: ResultProps) => {
	const { socket } = useSocket()
	const { roomId } = useParams<{ roomId: string }>()
	const [resultData, setResultData] = useState<PlayerResultData[]>([])

	useEffect(() => {
		if (!gameState.resultState) return

		const data: PlayerResultData[] = Array.from(gameState.resultState.entries()).map(([sessionId, playerResult]) => {
			return {
				sessionId: sessionId,
				nickname: gameState.players.find((p) => p.sessionId === sessionId)?.nickname ?? "Error: Could not find name",
				data: [playerResult.bank, ...playerResult.cashCards.map((card) => card.value)].reverse(),
			}
		})

		setResultData(data)
	}, [gameState.resultState])

	const returnToLobby = () => {
		socket.emit("StageChange", { roomId: roomId, stage: Stage.Lobby })
	}

	return (
		<div className="bg-[#1F002E] h-[100svh] text-white flex items-center justify-center flex-col">
			<div className="flex flex-col max-w-screen-md items-center justify-center p-6 pb-6 rounded-lg shadow-xl sm:p-8">
				<h2 className="text-xl font-bold mb-16">Standings</h2>
				{/* <span className="text-sm font-semibold text-gray-500">2020</span> */}
				<div className="flex items-end flex-grow w-full mt-2 space-x-2 sm:space-x-3">
					{resultData.map(({ sessionId, nickname, data }) => {
						return <VerticalBar key={sessionId} numBars={resultData.length} stack={data} nickname={nickname} />
					})}
				</div>
			</div>

			<Button onClick={returnToLobby} className="bg-indigo-400">
				Return to Lobby
			</Button>
		</div>
	)
}
