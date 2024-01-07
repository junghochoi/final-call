"use client"

import { getNickname } from "@/lib/utils"
import { start } from "./game"
import { useEffect, useState } from "react"
import { PlayerCard } from "./playerCard"
import { useParams } from "next/navigation"

function useNickname() {
	const [nickname, setNickname] = useState<string>("")

	useEffect(() => {
		const nickname = getNickname()
		if (nickname) setNickname(nickname)
		else setNickname("")
	}, [])
	return nickname
}

const GamePage = () => {
	const params = useParams<{ roomId: string }>()
	const nickname = useNickname()
	start({
		roomId: params.roomId,
	})

	return (
		<div>
			<p>Game Page</p>
			<PlayerCard nickname={nickname} />
		</div>
	)
}

export default GamePage
