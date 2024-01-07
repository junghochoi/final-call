
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NICKNAME_KEY = "nickname";
const DEFAULT_NICKNAME = "nonce"
const SANTA_COLOR_KEY = "santa";


function getItemFromLocalStorage(key: string, defaultValue: string) {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key) ?? defaultValue;
  }
  return defaultValue;
}

function persistItemToLocalStorage(key: string, value: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}


export function getNickname() {
  return getItemFromLocalStorage(NICKNAME_KEY, DEFAULT_NICKNAME);
}

export function persistNickname(newNickname: string) {
  persistItemToLocalStorage(NICKNAME_KEY, newNickname);
}
