import { ChangeEvent, useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { persistNickname } from "@/lib/utils"

import { Luckiest_Guy } from "next/font/google"
import { cn } from "@/lib/utils"

interface UsernameSelectionProps {
	handleUserJoinGame: (name: string) => void
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

const UsernameSelection: React.FC<UsernameSelectionProps> = (props) => {
	const [username, setUsername] = useState<string>("")
	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value)
	}
	const joinGame = () => {
		persistNickname(username)
		props.handleUserJoinGame(username)
	}

	return (
		<div className={"flex items-center justify-center flex-col bg-tolopea-950 min-h-screen"}>
			<div className="space-y-4">
				<h1 className={cn("text-white text-4xl", luckiestGuy.className)}>Pick a Username</h1>
				<Input onChange={handleUsernameChange} value={username} />
				<Button className="w-full bg-fuchsia-blue-600" onClick={joinGame}>
					Join Game
				</Button>
			</div>
		</div>
	)
}

export default UsernameSelection
