"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { persistNickname } from "@/lib/utils"
import { generateRandomKey } from "@/lib/utils"

import { Luckiest_Guy } from "next/font/google"

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export default function Home() {
	const [nickname, setNickname] = useState("")
	const router = useRouter()

	const createPrivateGame = async () => {
		// const lobby = await createHathoraLobby()
		const roomId = generateRandomKey()
		persistNickname(nickname)
		router.push(`/game/${roomId}`)
	}

	return (
		<div className="min-h-[calc(100svh-64px)] lg:max-w-screen-lg mx-auto  flex flex-col ">
			<div className="m-12">
				<h1
					className={cn(
						"text-center text-6xl lg:text-7xl 2xl:text-9xl font-bold text-white tracking-widest",
						luckiestGuy.className
					)}
				>
					Final Call
				</h1>
				<h2 className={cn("text-center text-fuchsia-blue-300", luckiestGuy.className)}>Game of Rags to Riches</h2>
			</div>

			<div className="flex justify-center mb-10">
				<div className="flex flex-col gap-6 w-2/3 lg:flex-row lg:w-3/4">
					<div className="p-6 rounded flex flex-col justify-center shadow-lg items-center gap-6 w-full lg:w-1/2 h-full bg-fuchsia-blue-950">
						<h2 className={cn("text-center text-fuchsia-blue-300 tracking-wide font-light", luckiestGuy.className)}>
							Future Avatar Selector
						</h2>
						<div className="h-48 w-48"></div>
						<Input
							className="w-2/3 focus:outline-none focus:ring focus:border-blue-500"
							placeholder="Nickname"
							onChange={(e) => {
								setNickname(e.target.value)
							}}
						/>

						<div className="flex flex-col space-y-3 justify-between items-center lg:flex-row lg:space-y-0 lg:space-x-2">
							<Button className="w-fit bg-fuchsia-blue-600 hover:bg-fuchsia-blue-400 shadow-md">
								Join Public game
							</Button>
							{/* <Separator className="bg-fc-accent px-4" /> */}
							<Button
								onClick={createPrivateGame}
								className="w-fit bg-fuchsia-blue-600 hover:bg-fuchsia-blue-400 shadow-md"
							>
								Create Private Game
							</Button>
						</div>
					</div>

					<div
						className={cn(
							"p-6 rounded w-full lg:w-1/2 shadow-lg text-center text-white  h-full  mb-12 hidden lg:block bg-fuchsia-blue-950",
							luckiestGuy.className
						)}
					>
						<h2 className={cn("text-fuchsia-blue-300")}>How to Play</h2>
						<div className="h-48 w-48"></div>
					</div>
				</div>
			</div>
		</div>
	)
}
