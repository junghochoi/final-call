import Image from "next/image"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
	return (
		<div className="h-[calc(100vh-64px)] lg:max-w-screen-lg mx-auto bg-amber-700">
			<div className="m-auto flex flex-col w-1/2 lg:flex-row lg:w-3/4 ">
				<Tabs defaultValue="public" className="w-full lg:w-1/2">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="public">Public</TabsTrigger>
						<TabsTrigger value="private">Private</TabsTrigger>
					</TabsList>
					<TabsContent value="public">
						<div className="min-h-64 bg-rose-300">
							Make changes to your account here.
						</div>
					</TabsContent>
					<TabsContent value="private">Change your password here.</TabsContent>
				</Tabs>

				<div className="w-full lg:w-1/2 bg-green-50 min-h-64">How to Play</div>
			</div>
		</div>
	)
}
