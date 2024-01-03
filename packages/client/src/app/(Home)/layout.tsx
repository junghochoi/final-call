import { HomeHeader } from "./header"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full bg-gradient-to-b from-fc-blue-dark to-fc-blue-light">
			<HomeHeader />
			{children}
		</div>
	)
}

export default HomeLayout
