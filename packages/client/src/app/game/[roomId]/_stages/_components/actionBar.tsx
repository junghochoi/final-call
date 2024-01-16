"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"

export const ActionBar = () => {
	const [bidMenuOpen, setBidMenuOpen] = useState<boolean>(false)

	const handleBidClick = () => {
		setBidMenuOpen((prev) => !prev)
	}

	return (
		<div className="h-28 mx-auto w-full bg-red-200 absolute bottom-0 flex justify-between">
			{!bidMenuOpen && (
				<>
					<div className="w-7/12 bg-blue-300">
						<p>Cards</p>
					</div>
					<div className="w-5/12 flex justify-around items-center">
						<Button className="m-0 p-0 h-2/3 lg:h-3/4 w-5/12">Pass</Button>
						<Button onClick={handleBidClick} className="m-0 p-0 h-2/3 lg:h-3/4 w-5/12">
							Bid
						</Button>
					</div>
				</>
			)}

			{bidMenuOpen && (
				<>
					<div className="w-7/12 bg-blue-300 p-4 flex justify-around">
						<div className=" bg-green-500 p-4 ">
							<p className="text-2xl text-center p-2">$14</p>
						</div>
						<div className="space-y-1 flex items-center flex-col lg:bg-pink-500 lg:flex-row w-3/5 lg:space-y-0">
							<Button className="m-0 p-0 h-10 w-10 lg:rounded-r-none">
								<Plus />
							</Button>
							<Slider className="hidden lg:inline-flex bg-gray-600 h-10 px-1" defaultValue={[33]} max={100} step={1} />
							<Button className="m-0 p-0 h-10 w-10 lg:rounded-l-none">
								<Minus />
							</Button>
						</div>
					</div>
					<div className="w-5/12 flex justify-around items-center">
						<Button className="m-0 p-0 h-2/3 lg:h-3/4 w-5/12">Bid</Button>
						<Button onClick={handleBidClick} className="m-0 p-0 h-2/3 lg:h-3/4 w-5/12">
							Cancel
						</Button>
					</div>
				</>
			)}
		</div>
	)
}
