import { useState, useEffect, useRef } from "react"

export function useAudio(path: string) {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	// const [audio, setAudio] = useState<HTMLAudioElement>()
	useEffect(() => {
		const audioElement = new Audio(path)

		audioRef.current = audioElement
	}, [])

	const play = () => {
		audioRef.current && audioRef.current.play()
	}

	return { play }
}
