import { BidState, Player, Stage } from "@final-call/shared"

import { PlayerBox } from "./playerBox"
import { zip } from "@/lib/utils"
import { Card } from "./card"

interface BiddingComponentProps {
	stage: Stage
	bidState: BidState
	currPlayer: Player
	currPlayerBank: number
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

const BOX_POSITION = 0
const BID_POSITION = 1

const playerPositions = zip(playerBoxPositions, playerBidPositions)

const playerPresentStyle = "bg-blue-300"
const playerAbsentStyle = "bg-gray-300"
const currPlayerStyle = "text-white"
const playerTurnStyle = "border-fc-accent border-2"

export const BiddingComponent = ({ stage, currPlayer, bidState, currPlayerBank }: BiddingComponentProps) => {
	return (
		<div className=" bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
			<div className="relative h-[calc(100%-7em)]">
				{/* Community Cards */}

				<div className="flex justify-center space-x-4 absolute h-16 md:h-28 : w-full bg-slate-400 top-[calc(50%-2rem)] md:top-[calc(50%-3.5rem)]">
					{stage === Stage.Bidding && bidState.roundCards.map((num: number) => <Card key={num} value={num} />)}
				</div>

				{bidState.playerOrder.map((player, ind) => {
					return (
						<PlayerBox
							positionTailwindStyle={playerPositions[ind][BOX_POSITION]}
							bidPositionTailwindStyle={playerPositions[ind][BID_POSITION]}
							playerPresenceTailwindStyle={playerPresentStyle}
							playerTurnTailwindStyle={bidState!.playerTurn === ind ? playerTurnStyle : undefined}
							currPlayerTailwindStyle={player.sessionId === currPlayer.sessionId ? currPlayerStyle : undefined}
							nickname={player.nickname}
							currPlayerBank={player.sessionId === currPlayer?.sessionId ? currPlayerBank : undefined}
							key={player.sessionId}
							bid={bidState!.playerBids.get(player.sessionId) ?? 0}
						/>
					)
				})}
				{Array.from({ length: 6 - (bidState.playerOrder.length || 0) }).map((_, ind) => (
					<PlayerBox
						positionTailwindStyle={playerPositions[ind + bidState.playerOrder.length][BOX_POSITION]}
						playerPresenceTailwindStyle={playerAbsentStyle}
						key={ind}
					/>
				))}
			</div>
		</div>
	)
}
