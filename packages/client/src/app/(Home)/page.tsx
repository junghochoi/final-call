"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createHathoraLobby } from "@/api/home"
import { persistNickname } from "@/lib/utils"

export default function Home() {
	const [nickname, setNickname] = useState("")
	const router = useRouter()
	const roomConfig = {
		name: "my-room",
	}

	const createPrivateGame = async () => {
		const lobby = await createHathoraLobby()
		persistNickname(nickname)
		router.push(`/game/${lobby.roomId}`)
	}

	return (
		<div className="flex justify-center pt-20 h-[calc(100vh-64px)] lg:max-w-screen-lg mx-auto ">
			<div className="flex flex-col gap-6 h-2/3 w-2/3 lg:flex-row lg:w-3/4 ">
				<div className="p-6 rounded flex flex-col justify-center items-center gap-6 w-full lg:w-1/2 bg-fc-blue-dark">
					<Input
						className="w-2/3"
						placeholder="Nickname"
						onChange={(e) => {
							setNickname(e.target.value)
						}}
					/>

					<div className="flex flex-col space-y-3 justify-between items-center lg:flex-row lg:space-y-0 lg:space-x-2">
						<Button className="w-fit">Join Public game</Button>
						{/* <Separator className="bg-fc-accent px-4" /> */}
						<Button onClick={createPrivateGame} className="w-fit">
							Create Private Game
						</Button>
					</div>
				</div>

				<div className="p-6 rounded w-full lg:w-1/2 bg-fc-blue-dark">How to Play</div>
			</div>
		</div>
	)
}
