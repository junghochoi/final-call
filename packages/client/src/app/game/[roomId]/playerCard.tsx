export const PlayerCard = ({ nickname }: { nickname: string }) => {
	return (
		<div className="p-5 bg-fc-blue border-b shadow-md">
			<h1>{nickname}</h1>
			<span>$14</span>
		</div>
	)
}
