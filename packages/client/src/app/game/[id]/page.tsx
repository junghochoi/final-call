"use client"

import { getNickname } from "@/lib/utils"
import { start } from "./game"
import { useEffect, useState } from "react"
import { PlayerCard } from "./playerCard"

function useNickname() {
	const [nickname, setNickname] = useState("")
	useEffect(() => {
		setNickname(getNickname())
	}, [])
	return nickname
}

const GamePage = () => {
	const nickname = useNickname()

	start()

	return (
		<div>
			<p>Game Page</p>
			<PlayerCard nickname={nickname} />
		</div>
	)
}

export default GamePage
