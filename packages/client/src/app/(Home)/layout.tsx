import { HomeHeader } from "./header"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="bg-yellow-50">
			<HomeHeader />
			{children}
		</div>
	)
}

export default HomeLayout
