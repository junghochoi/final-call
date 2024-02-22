import { HomeHeader } from "./header"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className=" bg-stone-700">
			<HomeHeader />
			{children}
		</div>
	)
}

export default HomeLayout
