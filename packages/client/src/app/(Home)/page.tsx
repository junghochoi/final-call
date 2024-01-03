import Image from "next/image"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Home() {
	return (
		<div className="flex justify-center pt-20 h-[calc(100vh-64px)] lg:max-w-screen-lg mx-auto ">
			<div className="flex flex-col gap-6 h-2/3 w-2/3 lg:flex-row lg:w-3/4 ">
				<div className="p-6 rounded flex flex-col justify-center items-center gap-6 w-full lg:w-1/2 bg-fc-blue-dark">
					<Input className="w-2/3" placeholder="Nickname" />

					<Button className="w-24">Start</Button>

					<Separator className="bg-fc-accent px-4" />
					{/* <div className="flex w-full">
						<Separator />
						<span> OR </span>
						<Separator />
					</div> */}

					<Button className="w-fit">Create Private Game</Button>
				</div>

				<div className="p-6 rounded w-full lg:w-1/2 bg-fc-blue-dark">
					How to Play
				</div>
			</div>
		</div>
	)
}
