import { ActionBar } from "./_components/actionBar"

export const Game = () => {
	return (
		<div className="bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
			<div className="relative h-[calc(100%-6rem)]">
				<div className="absolute w-20 h-14 md:w-28 md:h-20 bg-blue-300 left-[calc(50%-2.5rem)] top-[0.5rem]">
					<p>Player Number 4</p>
				</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-20 bg-blue-300 left-[0.5rem] top-[20%]">
					<p>Player Number 3</p>
				</div>

				<div className="absolute w-20 h-14 md:w-28 md:h-20 bg-blue-300 right-[0.5rem] bottom-[20%]">
					<p>Player Number 2</p>
				</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-20 bg-blue-300 left-[0.5rem] bottom-[20%]">
					<p>Player Number 1</p>
				</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-20 bg-blue-300 left-[calc(50%-2.5rem)] bottom-[0.5rem]">
					<p>Player Number 5</p>
				</div>
				<div className="absolute w-20 h-14 md:w-28 md:h-20 bg-blue-300 right-[0.5rem] top-[20%]">
					<p>Player Number 6</p>
				</div>
			</div>
			<ActionBar />
		</div>
	)
}
