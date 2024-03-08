import { ChangeEvent, useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { persistNickname } from "@/lib/utils"

import { Luckiest_Guy } from "next/font/google"
import { cn } from "@/lib/utils"
import { useSocket } from "@/contexts/SocketContext"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useParams } from "next/navigation"

interface UsernameSelectionProps {
	handleUserJoinGame: (name: string) => void
}

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

const UsernameSelection: React.FC<UsernameSelectionProps> = (props) => {
	const [username, setUsername] = useState<string>("")
	const { socket } = useSocket()
	const { toast } = useToast()
	const { roomId } = useParams<{ roomId: string }>()
	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value)
	}
	const joinGame = () => {
		if (username.length < 3 || username.length > 10) {
			toast({
				title: "Username Error",
				description: "Use a Nickname Between 3 to 10 characters ",
				variant: "destructive",
			})
			return
		}

		socket.emit("CanPlayerJoin", roomId, ({ error, message }) => {
			if (error) {
				toast({
					title: "Error",
					description: message,
					variant: "destructive",
				})
			} else {
				persistNickname(username)
				props.handleUserJoinGame(username)
			}
		})
	}

	return (
		<div className={"flex items-center justify-center flex-col bg-tolopea-950 min-h-screen"}>
			<div className="space-y-4">
				<h1 className={cn("text-white text-4xl", luckiestGuy.className)}>Pick a Username</h1>
				<Input onChange={handleUsernameChange} value={username} />
				<Button className="w-full bg-fuchsia-blue-600 hover:bg-fuchsia-blue-400" onClick={joinGame}>
					Join Game
				</Button>
			</div>
		</div>
	)
}

export default UsernameSelection
