import ThreeDotsWave from "@/app/game/[roomId]/threeDotLoading"
import { cn } from "@/lib/utils"
import { Luckiest_Guy } from "next/font/google"

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: ["400"],
})

export const Loading = (props: { message: string }) => {
	return (
		<div className="absolute w-full h-[100dvh] flex flex-col justify-center items-center bg-tolopea-950 bg-opacity-80 z-10">
			<div className={cn("text-white font-bold text-2xl", luckiestGuy.className)}>{props.message}</div>
			<ThreeDotsWave />
		</div>
	)
}
