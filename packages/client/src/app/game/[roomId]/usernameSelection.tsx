import { ChangeEvent, useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { persistNickname } from "@/lib/utils"

interface UsernameSelectionProps {
	handleUserJoinGame: (name: string) => void
}

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
		<div>
			<h1>User Name needs to be Defined</h1>
			<Input onChange={handleUsernameChange} value={username} />
			<Button onClick={joinGame}>Join Game</Button>
		</div>
	)
}

export default UsernameSelection
