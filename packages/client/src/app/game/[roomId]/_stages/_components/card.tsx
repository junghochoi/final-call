interface CardProps {
	value: number
}

export const Card = ({ value }: CardProps) => {
	return <div className="h-full w-12 border border-black">{value}</div>
}
