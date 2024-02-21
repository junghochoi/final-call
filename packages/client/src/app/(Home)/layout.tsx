import { HomeHeader } from "./header"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full bg-blue-400">
			<HomeHeader />
			{children}
		</div>
	)
}

export default HomeLayout
