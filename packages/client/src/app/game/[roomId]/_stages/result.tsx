import { useSocket } from "@/contexts/SocketContext"
import { Card, CardType, GameState, SessionID, Stage } from "@final-call/shared"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { heightStyle, backgroundStyle } from "@/lib/dynamicStyles"
import { motion } from "framer-motion"
import { Poppins } from "next/font/google"

interface ResultProps {
	gameState: GameState
}

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["700"],
})

const VerticalBar = ({ numBars, stack, nickname }: { numBars: number; stack: Card[]; nickname: string }) => {
	const barWidthStyle = numBars <= 3 ? "w-32" : "w-14"

	const [sum, setSum] = useState(0)

	const addToSum = (value: number) => {
		console.log("animation end")
		setSum((prev) => prev + value)
	}

	return (
		<motion.div
			className={cn("relative flex flex-col items-center flex-grow pb-5 group", barWidthStyle)}
			animate={{
				transition: {
					staggerChildren: 3,
				},
			}}
		>
			{/* Add "hidden group-hover:block" if you want it to be shown on hover */}
			<span>{sum}</span>
			{stack.map((card: Card, index) => {
				const delay = (stack.length - index) * 3

				return (
					<motion.div
						key={card.id}
						className={cn(
							"relative flex flex-col justify-center w-full",
							backgroundStyle[(index + 1) * 100],
							heightStyle[card.value]
						)}
						initial={{ height: 0 }}
						animate={{ height: card.value * 4, transition: { delay: delay, duration: 1 } }}
						onAnimationComplete={() => addToSum(card.value)}
					>
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: delay, duration: 2 } }}
							className={cn(
								"text-center text-lavender-magenta-4  drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]",
								poppins.className
							)}
						>
							{card.value}
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
	data: Card[]
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
				data: [
					{ value: playerResult.bank, type: CardType.Cash, id: `${sessionId}_bank` },
					...playerResult.cashCards,
				].reverse(),
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

			<Button onClick={returnToLobby} disabled={!gameState.currPlayer?.host} className="bg-indigo-400">
				{gameState.currPlayer?.host ? "Return to Lobby" : "Waiting for Host ..."}
			</Button>
		</div>
	)
}
