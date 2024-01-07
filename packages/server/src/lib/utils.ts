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
