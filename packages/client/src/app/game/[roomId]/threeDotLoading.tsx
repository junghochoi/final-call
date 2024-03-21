import { Transition, motion } from "framer-motion"
import React from "react"

const LoadingDot = {
	display: "block",
	width: "2rem",
	height: "2rem",
	backgroundColor: "white",
	borderRadius: "50%",
}

const LoadingContainer = {
	width: "10rem",
	height: "5rem",
	display: "flex",
	justifyContent: "space-around",
}

const ContainerVariants = {
	initial: {
		transition: {
			staggerChildren: 0.2,
		},
	},
	animate: {
		transition: {
			staggerChildren: 0.2,
		},
	},
}

const DotVariants = {
	initial: {
		y: "0%",
	},
	animate: {
		y: "100%",
	},
}

const DotTransition: Transition = {
	duration: 0.5,
	repeat: Infinity,
	repeatType: "reverse",
	ease: "easeInOut",
}

export default function ThreeDotsWave() {
	return (
		<div
			style={{
				paddingTop: "5rem",
				width: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<motion.div
				key={"loading_group"}
				style={LoadingContainer}
				variants={ContainerVariants}
				initial="initial"
				animate="animate"
			>
				<motion.span key={"loading_group_1"} style={LoadingDot} variants={DotVariants} transition={DotTransition} />
				<motion.span key={"loading_group_2"} style={LoadingDot} variants={DotVariants} transition={DotTransition} />
				<motion.span key={"loading_group_3"} style={LoadingDot} variants={DotVariants} transition={DotTransition} />
			</motion.div>
		</div>
	)
}
