import { useState, useEffect } from "react"

export function useAudio(path: string) {
	const [audio, setAudio] = useState<HTMLAudioElement>()

	useEffect(() => {
		const audioElement = new Audio(path)

		setAudio(audioElement)
	}, [])

	return audio
}
