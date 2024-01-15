"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export const ActionBar = () => {
	const [bidMenuOpen, setBidMenuOpen] = useState<boolean>(false)

	const handleBidClick = () => {
		setBidMenuOpen((prev) => !prev)
	}

	return (
		<div className="h-24 mx-auto w-full bg-red-200 absolute bottom-0 flex justify-between">
			{!bidMenuOpen && (
				<>
					<div className="w-7/12 bg-blue-300">
						<p>Cards</p>
					</div>
					<div className="w-5/12 flex justify-around items-center">
						<Button className="h-2/3 lg:h-3/4 w-5/12">Pass</Button>
						<Button onClick={handleBidClick} className="h-2/3 lg:h-3/4 w-5/12">
							Bid
						</Button>
					</div>
				</>
			)}

			{bidMenuOpen && (
				<>
					<div className="w-7/12 bg-blue-300">
						<p>Menu</p>
					</div>
					<div className="w-5/12 flex justify-around items-center">
						<Button className="h-2/3 lg:h-3/4 w-5/12">Bid</Button>
						<Button onClick={handleBidClick} className="h-2/3 lg:h-3/4 w-5/12">
							Cancel
						</Button>
					</div>
				</>
			)}
		</div>
	)
}
