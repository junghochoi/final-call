import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

const NICKNAME_KEY = "nickname"
const DEFAULT_NICKNAME = undefined
const SESSION_ID_KEY = "npt"
const DEFAULT_SESSION_ID = undefined

function getItemFromLocalStorage(
	key: string,
	defaultValue: string | undefined
) {
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
