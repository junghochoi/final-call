"use client"

import localFont from "next/font/local"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createHathoraLobby } from "@/api/home"
import { persistNickname } from "@/lib/utils"

import { Titan_One, Coiny, DynaPuff, Josefin_Sans, Luckiest_Guy } from "next/font/google"

const titanOne = Titan_One({
	subsets: ["latin-ext"],
	weight: ["400"],
})

const coiny = Coiny({
	subsets: ["latin"],
	weight: "400",
})

const dynaPuff = DynaPuff({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
})

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export default function Home() {
	const [nickname, setNickname] = useState("")
	const router = useRouter()

	const createPrivateGame = async () => {
		const lobby = await createHathoraLobby()
		persistNickname(nickname)
		router.push(`/game/${lobby.roomId}`)
	}

	return (
		<div className="lg:h-[calc(100vh-64px)] lg:max-w-screen-lg mx-auto  flex flex-col ">
			<div className="m-12">
				<h1 className={cn("text-center text-8xl font-bold text-white", luckiestGuy.className)}>Final Call</h1>
				<h2 className={cn("text-center text-white", luckiestGuy.className)}>Game of Rags to Riches</h2>
			</div>

			<div className="flex justify-center">
				<div className="flex flex-col gap-6 w-2/3 lg:flex-row lg:w-3/4">
					<div className="p-6 rounded flex flex-col justify-center shadow-lg items-center gap-6 w-full lg:w-1/2 h-full bg-black bg-opacity-15">
						<h2 className={cn("text-center text-white", luckiestGuy.className)}>Future Avatar Selector</h2>
						<div className="h-48 w-48"></div>
						<Input
							className="w-2/3 focus:outline-none focus:ring focus:border-blue-500"
							placeholder="Nickname"
							onChange={(e) => {
								setNickname(e.target.value)
							}}
						/>

						<div className="flex flex-col space-y-3 justify-between items-center lg:flex-row lg:space-y-0 lg:space-x-2">
							<Button className="w-fit bg-fuchsia-400 hover:bg-fuchsia-500 shadow-md">Join Public game</Button>
							{/* <Separator className="bg-fc-accent px-4" /> */}
							<Button onClick={createPrivateGame} className="w-fit bg-fuchsia-400 hover:bg-fuchsia-500 shadow-md">
								Create Private Game
							</Button>
						</div>
					</div>

					<div
						className={cn(
							"p-6 rounded w-full lg:w-1/2 shadow-lg text-center text-white bg-black h-full bg-opacity-15 mb-12",
							luckiestGuy.className
						)}
					>
						<h2 className={cn("")}>How to Play</h2>
						<div className="h-48 w-48"></div>
					</div>
				</div>
			</div>
		</div>
	)
}
