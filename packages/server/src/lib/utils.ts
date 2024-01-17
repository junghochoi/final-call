function generateCode(): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	let code = ""
	for (let i = 0; i < 6; i++) {
		code += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return code
}

export function generateSessionId() {
	return "npt-" + generateCode()
}

export function shuffle(array: any[]) {
	let currentIndex = array.length,
		randomIndex

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
	}

	return array
}
