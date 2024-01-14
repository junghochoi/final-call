import { Button } from "@/components/ui/button"

export const ActionBar = () => {
	return (
		<div className="h-24 mx-auto w-full bg-red-200 absolute bottom-0 flex justify-between">
			<div className="w-2/3 bg-blue-300">
				<p>Cards</p>
			</div>
			<div className="w-1/3">
				<Button>Pass</Button>
				<Button>Bid</Button>
			</div>
		</div>
	)
}
