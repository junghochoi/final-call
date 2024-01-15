import { ActionBar } from "./_components/actionBar"

export const Game = () => {
	return (
		<div className="bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
			<div className="relative">
				<div className="absolute w-20 h-14 bg-blue-300 left-[calc(50%-2.5rem)] top-[0.5rem]">
					<p>Player Number 4</p>
				</div>
				<div className="absolute w-20 h-14 bg-blue-300 left-[0.5rem] top-1/3]">
					<p>Player Number 3</p>
				</div>

				<div className="absolute w-20 h-14 bg-blue-300 right-[0.5rem] top-[6rem]">
					<p>Player Number 2</p>
				</div>
				<div className="absolute w-20 h-14 bg-blue-300 left-[0.5rem] top-[24rem]">
					<p>Player Number 1</p>
				</div>
				<div className="absolute w-28 h-20 bg-blue-300 left-[calc(50%-2.5rem)] top-[36rem]">
					<p>Player Number 5</p>
				</div>
				{/* <div className="absolute w-28 h-20 bg-blue-300 left-[9.2rem]">
					<p>Player Number 4</p>
				</div>
				<div className="absolute w-28 h-20 bg-blue-300 left-[9.2rem]">
					<p>Player Number 4</p>
				</div> */}
			</div>
			<ActionBar />
		</div>
	)
}
