import { HomeHeader } from "./header"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className=" bg-tolopea-950">
			<HomeHeader />
			{children}
		</div>
	)
}

export default HomeLayout
