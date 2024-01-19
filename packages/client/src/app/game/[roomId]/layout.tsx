import { SocketProvider } from "@/contexts/SocketContext"
export default function GameLayout({ children }: { children: React.ReactNode }) {
	return <SocketProvider>{children}</SocketProvider>
}
