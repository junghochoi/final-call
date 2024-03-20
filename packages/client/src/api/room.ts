import { USE_LOCAL_WS } from "@/config"

export interface ConnectionInfo {
	host: string
	port: string
}

export function getConnectionInfo(): ConnectionInfo {
	if (USE_LOCAL_WS) {
		return {
			host: process.env.host || "localhost",
			port: process.env.port || "8000",
		}
	}

	//https://final-call-3-0.onrender.com

	return {
		host: "final-call-3-0.onrender.com",
		port: "10000",
	}
}
