import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

const NICKNAME_KEY = "nickname"
const DEFAULT_NICKNAME = undefined
const SESSION_ID_KEY = "npt"
const DEFAULT_SESSION_ID = undefined

function getItemFromLocalStorage(key: string, defaultValue: string | undefined) {
	if (typeof window !== "undefined") {
		return window.sessionStorage.getItem(key) ?? defaultValue
	}
	return defaultValue
}

function persistItemToLocalStorage(key: string, value: string) {
	if (typeof window !== "undefined") {
		window.sessionStorage.setItem(key, value)
	}
}

export function getSessionId() {
	return getItemFromLocalStorage(SESSION_ID_KEY, DEFAULT_SESSION_ID)
}

export function persistSessionId(sessionId: string) {
	return persistItemToLocalStorage(SESSION_ID_KEY, sessionId)
}

export function getNickname() {
	return getItemFromLocalStorage(NICKNAME_KEY, DEFAULT_NICKNAME)
}

export function persistNickname(newNickname: string) {
	persistItemToLocalStorage(NICKNAME_KEY, newNickname)
}

// function useWindowSize() {
// 	// Initialize state with undefined width/height so server and client renders match
// 	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
// 	const [windowSize, setWindowSize] = useState({
// 		width: undefined,
// 		height: undefined,
// 	})

// 	useEffect(() => {
// 		// only execute all the code below in client side
// 		// Handler to call on window resize
// 		function handleResize() {
// 			// Set window width/height to state
// 			setWindowSize({
// 				width: window.innerWidth,
// 				height: window.innerHeight,
// 			})
// 		}

// 		// Add event listener
// 		window.addEventListener("resize", handleResize)

// 		// Call handler right away so state gets updated with initial window size
// 		handleResize()

// 		// Remove event listener on cleanup
// 		return () => window.removeEventListener("resize", handleResize)
// 	}, []) // Empty array ensures that effect is only run on mount
// 	return windowSize
// }
