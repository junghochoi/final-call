import { Toaster } from "@/components/ui/toaster"
import { SocketProvider } from "@/contexts/SocketContext"
export default function GameLayout({ children }: { children: React.ReactNode }) {
	return (
		<SocketProvider>
			<Toaster />
			{children}
		</SocketProvider>
	)
}
