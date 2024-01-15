import { ActionBar } from "./_components/actionBar"

export const Game = () => {
	return (
		<div className="bg-green-200 h-screen max-w-screen-lg mx-auto relative overscroll-none">
			<div>Seats</div>
			<ActionBar />
		</div>
	)
}
